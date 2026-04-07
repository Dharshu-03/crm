import express from "express";
import multer from "multer";
import Employee from "../models/employee.js"
import { addEmployee } from "../controllers/employeecontroller.js";
import Lead from "../models/leads.js";
const router = express.Router();

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
export default router;