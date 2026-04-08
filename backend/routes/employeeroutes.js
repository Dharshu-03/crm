import express from "express";
import multer from "multer";
import Employee from "../models/employee.js"
import { addEmployee } from "../controllers/employeecontroller.js";
import Lead from "../models/leads.js";
const router = express.Router();
import mongoose from "mongoose";

router.post("/add", addEmployee);
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const matchStage = {};

        if (search.trim()) {
            matchStage.$or = [
                { fname: { $regex: search.trim(), $options: "i" } },
                { lname: { $regex: search.trim(), $options: "i" } }
            ];
        }

        const total = await Employee.countDocuments(matchStage);

        const employees = await Employee.aggregate([
            { $match: matchStage },

            // 🔥 Join leads
            {
                $lookup: {
                    from: "leads",
                    localField: "_id",
                    foreignField: "employeeId",
                    as: "leads"
                }
            },

            // 🔥 Count ongoing + closed
            {
                $addFields: {
                    ongoingLeads: {
                        $size: {
                            $filter: {
                                input: "$leads",
                                as: "lead",
                                cond: { $eq: ["$$lead.status", "ongoing"] }
                            }
                        }
                    },
                    closedLeads: {
                        $size: {
                            $filter: {
                                input: "$leads",
                                as: "lead",
                                cond: { $eq: ["$$lead.status", "closed"] }
                            }
                        }
                    }
                }
            },

            {
                $addFields: {
                    status: {
                        $cond: [
                            { $gt: ["$ongoingLeads", 0] },
                            "Active",
                            "Inactive"
                        ]
                    }
                }
            },

            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        res.json({
            employees,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});




router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 🔥 Check if employee has assigned leads
        const leadCount = await Lead.countDocuments({
            employeeId: new mongoose.Types.ObjectId(id)
        });

        if (leadCount > 0) {
            return res.status(400).json({
                message: "Cannot delete employee with assigned leads"
            });
        }

        const deleted = await Employee.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/delete-multiple", async (req, res) => {
    try {
        const { ids } = req.body;

        // 🔥 find employees with assigned leads
        const employeesWithLeads = await Lead.distinct("employeeId", {
            employeeId: { $in: ids }
        });

        if (employeesWithLeads.length > 0) {
            return res.status(400).json({
                message: "Some employees have assigned leads. Cannot delete."
            });
        }

        await Employee.deleteMany({
            _id: { $in: ids }
        });

        res.json({ message: "Deleted multiple employees" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Employee.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(updated);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/active", async (req, res) => {
    try {
        const employees = await Employee.aggregate([
            {
                $lookup: {
                    from: "leads",
                    localField: "_id",
                    foreignField: "employeeId",
                    as: "leads"
                }
            },
            {
                $addFields: {
                    ongoingLeads: {
                        $size: {
                            $filter: {
                                input: "$leads",
                                as: "lead",
                                cond: { $eq: ["$$lead.status", "ongoing"] }
                            }
                        }
                    },
                    closedLeads: {
                        $size: {
                            $filter: {
                                input: "$leads",
                                as: "lead",
                                cond: { $eq: ["$$lead.status", "closed"] }
                            }
                        }
                    }
                }
            },

            // ✅ Only ACTIVE employees
            {
                $match: {
                    ongoingLeads: { $gt: 0 }
                }
            },

            // ✅ Add status
            {
                $addFields: {
                    status: "Active"
                }
            },

            {
                $project: {
                    fname: 1,
                    lname: 1,
                    _id: 1,
                    ongoingLeads: 1,
                    closedLeads: 1,
                    status: 1
                }
            },

            { $sort: { ongoingLeads: -1 } }
        ]);

        res.json(employees);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/dashboard/kpi", async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const unassignedLeads = await Lead.countDocuments({
            $or: [
                { employeeId: null },
                { employeeId: { $exists: false } }
            ]
        });

        const assignedThisWeek = await Lead.countDocuments({
            employeeId: { $ne: null },
            createdAt: { $gte: startOfWeek }
        });

        const totalClosed = await Lead.countDocuments({
            status: "closed"
        });

        const totalAssigned = await Lead.countDocuments({
            employeeId: { $ne: null }
        });

        const activeEmployees = await Lead.distinct("employeeId", {
            employeeId: { $ne: null },
            status: "ongoing"
        });

        const conversionRate =
            totalAssigned === 0
                ? 0
                : ((totalClosed / totalAssigned) * 100).toFixed(2);

        res.json({
            unassignedLeads,
            assignedThisWeek,
            activeSalesPeople: activeEmployees.length,
            conversionRate
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/dashboard/conversion-trend", async (req, res) => {
    try {
        const days = [];
        for (let i = 13; i >= 0; i--) {
            const start = new Date();
            start.setDate(start.getDate() - i);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setHours(23, 59, 59, 999);

            const totalAssigned = await Lead.countDocuments({
                employeeId: { $ne: null },
                createdAt: { $gte: start, $lte: end }
            });

            const totalClosed = await Lead.countDocuments({
                status: "closed",
                updatedAt: { $gte: start, $lte: end }
            });

            const rate = totalAssigned === 0 ? 0 : parseFloat(((totalClosed / totalAssigned) * 100).toFixed(2));

            days.push({
                date: start.toISOString().split("T")[0],
                rate
            });
        }

        res.json(days);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("employee/dashboard/recent-activity", async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(7);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
export default router;