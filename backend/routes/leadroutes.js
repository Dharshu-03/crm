import express from "express";
import multer from "multer";
import Lead from "../models/leads.js";
import { addLead } from "../controllers/leadcontroller.js";
const router = express.Router();

router.post("/add", addLead);

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

        const total = await Lead.countDocuments(query);
        const leads = await Lead.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            leads,
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