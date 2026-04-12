import express from "express";
import Attendance from "../models/attendance.js";
import { verifyToken } from "../authMiddleware.js";

const router = express.Router();

// helper → today's date
const getToday = () => {
    const now = new Date();
    return now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
};
router.post("/check-in", verifyToken, async (req, res) => {
    try {
        const employeeId = req.user.id;

        const today = getToday();

        let record = await Attendance.findOne({ employeeId, date: today });

        if (record && record.checkIn) {
            return res.status(400).json({ error: "Already checked in" });
        }

        if (!record) {
            record = new Attendance({
                employeeId,
                date: today,
                checkIn: new Date()
            });
        } else {
            record.checkIn = new Date();
        }

        await record.save();

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/check-out", verifyToken, async (req, res) => {
    try {
        const employeeId = req.user.id;

        const today = getToday();

        const record = await Attendance.findOne({ employeeId, date: today });

        if (!record || !record.checkIn) {
            return res.status(400).json({ error: "Check-in first" });
        }

        if (record.checkOut) {
            return res.status(400).json({ error: "Already checked out" });
        }

        record.checkOut = new Date();
        await record.save();

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/break-start", verifyToken, async (req, res) => {
    try {
        const employeeId = req.user.id;

        const today = getToday();

        const record = await Attendance.findOne({ employeeId, date: today });

        if (!record) return res.status(400).json({ error: "Check-in first" });

        if (record.breakStart) {
            return res.status(400).json({ error: "Break already started" });
        }

        record.breakStart = new Date();
        await record.save();

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/break-end", verifyToken, async (req, res) => {
    try {
        const employeeId = req.user.id;

        const today = getToday();

        const record = await Attendance.findOne({ employeeId, date: today });

        if (!record || !record.breakStart) {
            return res.status(400).json({ error: "Start break first" });
        }

        if (record.breakEnd) {
            return res.status(400).json({ error: "Break already ended" });
        }

        record.breakEnd = new Date();
        await record.save();

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/today/:employeeId", verifyToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.employeeId) {
            return res.status(403).json({ error: "Access denied" });
        }
        const today = getToday();

        let record = await Attendance.findOne({
            employeeId: req.params.employeeId,
            date: today
        });



        if (!record) {
            return res.json({
                checkIn: null,
                checkOut: null,
                breakStart: null,
                breakEnd: null
            });
        }

        res.json(record);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/break-history/:employeeId", verifyToken, async (req, res) => {
    try {
        // ✅ check first, before any DB query
        if (req.user.id !== req.params.employeeId) {
            return res.status(403).json({ error: "Access denied" });
        }

        const records = await Attendance.find({
            employeeId: req.params.employeeId,
            breakStart: { $ne: null },
            breakEnd: { $ne: null }
        })
            .sort({ date: -1 })
            .limit(4);

        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;