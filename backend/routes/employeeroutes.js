// routes/employee.js  — updated with verifyToken imported from authMiddleware
import express from "express";
import Employee from "../models/employee.js";
import Lead from "../models/leads.js";
import Activity from "../models/activity.js";
import { addEmployee } from "../controllers/employeecontroller.js";
import { isAdmin, verifyToken } from "../authMiddleware.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ─────────────────────────────────────────────
   ADMIN ROUTES  (protected by isAdmin key)
───────────────────────────────────────────── */

// Add employee
router.post("/add", isAdmin, addEmployee);

// Get admin profile
router.get("/admin", isAdmin, async (req, res) => {
    const admin = await Employee.findOne({ role: "admin" });
    res.json(admin);
});

// Update admin profile (fname, lname, password)
router.put("/admin", isAdmin, async (req, res) => {
    try {
        const updates = { ...req.body };

        // Hash password if being changed
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const updated = await Employee.findOneAndUpdate(
            { role: "admin" },
            updates,
            { new: true }
        ).select("-password");

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete multiple employees
router.post("/delete-multiple", isAdmin, async (req, res) => {
    try {
        const { ids } = req.body;
        const employeesWithLeads = await Lead.distinct("employeeId", {
            employeeId: { $in: ids }
        });
        if (employeesWithLeads.length > 0) {
            return res.status(400).json({
                message: "Some employees have assigned leads. Cannot delete."
            });
        }
        await Employee.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Deleted multiple employees" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ─────────────────────────────────────────────
   DASHBOARD ROUTES  (admin only)
───────────────────────────────────────────── */

router.get("/dashboard/kpi", isAdmin, async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const [unassignedLeads, assignedThisWeek, totalClosed, totalAssigned, activeEmployees] =
            await Promise.all([
                Lead.countDocuments({ $or: [{ employeeId: null }, { employeeId: { $exists: false } }] }),
                Lead.countDocuments({ employeeId: { $ne: null }, createdAt: { $gte: startOfWeek } }),
                Lead.countDocuments({ status: "closed" }),
                Lead.countDocuments({ employeeId: { $ne: null } }),
                Lead.distinct("employeeId", { employeeId: { $ne: null }, status: "ongoing" })
            ]);

        const conversionRate = totalAssigned === 0
            ? 0
            : ((totalClosed / totalAssigned) * 100).toFixed(2);

        res.json({ unassignedLeads, assignedThisWeek, activeSalesPeople: activeEmployees.length, conversionRate });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/dashboard/conversion-trend", isAdmin, async (req, res) => {
    try {
        const days = [];
        for (let i = 13; i >= 0; i--) {
            const start = new Date();
            start.setDate(start.getDate() - i);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setHours(23, 59, 59, 999);

            const [totalAssigned, totalClosed] = await Promise.all([
                Lead.countDocuments({ employeeId: { $ne: null }, createdAt: { $gte: start, $lte: end } }),
                Lead.countDocuments({ status: "closed", updatedAt: { $gte: start, $lte: end } })
            ]);

            days.push({
                date: start.toISOString().split("T")[0],
                rate: totalAssigned === 0 ? 0 : parseFloat(((totalClosed / totalAssigned) * 100).toFixed(2))
            });
        }
        res.json(days);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/dashboard/recent-activity", isAdmin, async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(7);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ─────────────────────────────────────────────
   EMPLOYEE SELF ROUTES  (protected by JWT)
───────────────────────────────────────────── */

// Get own profile
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await Employee.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "Employee not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update own profile (password, fname, lname)
router.put("/me", verifyToken, async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        const updated = await Employee.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Recent activity for a specific employee
router.get("/recent-activity/:employeeId", verifyToken, async (req, res) => {
    try {
        const { employeeId } = req.params;
        const activities = await Activity.find({
            employeeId: new mongoose.Types.ObjectId(employeeId)
        }).sort({ createdAt: -1 }).limit(7);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ─────────────────────────────────────────────
   EMPLOYEE LOGIN
───────────────────────────────────────────── */

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (employee.role === "admin") {
            return res.status(403).json({ message: "Admin login not allowed here" });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: employee._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            employee: {
                id: employee._id,
                fname: employee.fname,
                lname: employee.lname
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ─────────────────────────────────────────────
   PAGINATED EMPLOYEE LIST  (admin)
───────────────────────────────────────────── */

router.get("/", isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const matchStage = { role: { $ne: "admin" } };
        if (search.trim()) {
            matchStage.$or = [
                { fname: { $regex: search.trim(), $options: "i" } },
                { lname: { $regex: search.trim(), $options: "i" } }
            ];
        }

        const total = await Employee.countDocuments(matchStage);
        const employees = await Employee.aggregate([
            { $match: matchStage },
            { $lookup: { from: "leads", localField: "_id", foreignField: "employeeId", as: "leads" } },
            {
                $addFields: {
                    ongoingLeads: { $size: { $filter: { input: "$leads", as: "lead", cond: { $eq: ["$$lead.status", "ongoing"] } } } },
                    closedLeads: { $size: { $filter: { input: "$leads", as: "lead", cond: { $eq: ["$$lead.status", "closed"] } } } }
                }
            },
            { $addFields: { status: { $cond: [{ $gt: ["$ongoingLeads", 0] }, "Active", "Inactive"] } } },
            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        res.json({ employees, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/active", isAdmin, async (req, res) => {
    try {
        const employees = await Employee.aggregate([
            { $lookup: { from: "leads", localField: "_id", foreignField: "employeeId", as: "leads" } },
            {
                $addFields: {
                    ongoingLeads: { $size: { $filter: { input: "$leads", as: "lead", cond: { $eq: ["$$lead.status", "ongoing"] } } } },
                    closedLeads: { $size: { $filter: { input: "$leads", as: "lead", cond: { $eq: ["$$lead.status", "closed"] } } } }
                }
            },
            { $match: { ongoingLeads: { $gt: 0 } } },
            { $addFields: { status: "Active" } },
            { $project: { fname: 1, lname: 1, _id: 1, ongoingLeads: 1, closedLeads: 1, status: 1 } },
            { $sort: { ongoingLeads: -1 } }
        ]);
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ─────────────────────────────────────────────
   SINGLE EMPLOYEE CRUD  (admin)
   ⚠  Keep these AFTER all named routes
───────────────────────────────────────────── */

router.get("/:id", isAdmin, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        if (employee.role === "admin") return res.status(403).json({ message: "Admin not accessible here" });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", isAdmin, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        if (employee.role === "admin") return res.status(400).json({ message: "Admin cannot be modified here" });

        const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        if (employee.role === "admin") return res.status(400).json({ message: "Admin cannot be deleted" });

        const leadCount = await Lead.countDocuments({
            employeeId: new mongoose.Types.ObjectId(req.params.id)
        });
        if (leadCount > 0) {
            return res.status(400).json({ message: "Cannot delete employee with assigned leads" });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;