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

export default router;