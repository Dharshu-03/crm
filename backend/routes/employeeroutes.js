import express from "express";
import multer from "multer";
import Employee from "../models/employee.js"
import { addEmployee } from "../controllers/employeecontroller.js";
const router = express.Router();

router.post("/add", addEmployee);
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const query = {};

        if (search.trim()) {
            query.name = { $regex: search.trim(), $options: "i" };
        }

        const total = await Employee.countDocuments(query);
        const employees = await Employee.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

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
    const { ids } = req.body;

    await Employee.deleteMany({
        _id: { $in: ids }
    });

    res.json({ message: "Deleted multiple employees" });
});
export default router;