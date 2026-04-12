import express from "express";
import multer from "multer";
import Lead from "../models/leads.js";
import { addLead } from "../controllers/leadcontroller.js";
import fs from "fs";
import readline from "readline";
import Employee from "../models/employee.js";
import logActivity from "../utils/logActivity.js";
import mongoose from "mongoose";


const router = express.Router();

// Multer config
const upload = multer({ dest: "/tmp/" });

/* ================= CSV UPLOAD ================= */
router.post("/upload-csv", upload.single("csv"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    try {
        const leads = await parseCsvWithStreams(filePath);

        if (leads.length === 0) {
            return res.status(400).json({ error: "CSV is empty or invalid" });
        }

        const insertedLeads = await Lead.insertMany(leads, { ordered: false });

        const employees = await Employee.find();
        const bulkOps = [];

        for (const lead of insertedLeads) {
            const employee = employees.find(
                (emp) =>
                    emp.language?.toLowerCase() ===
                    lead.language?.toLowerCase()
            );

            if (employee) {
                console.log("employee._id →", employee._id, typeof employee._id);
                bulkOps.push({
                    updateOne: {
                        filter: { _id: lead._id },
                        update: {
                            $set: {
                                employeeId: employee._id,
                                assignedDate: new Date(), // ✅ FIX
                            },
                        },
                    },
                });

                await logActivity(
                    "lead_assigned",
                    `Lead ${lead.name} assigned to ${employee.fname}`,
                    new mongoose.Types.ObjectId(employee._id)
                );
            }
        }

        if (bulkOps.length > 0) {
            await Lead.bulkWrite(bulkOps);
        }

        res.json({
            message: `${insertedLeads.length} leads imported successfully`,
            count: insertedLeads.length,
        });
    } catch (err) {
        console.error("CSV upload error:", err);
        res.status(500).json({ error: "Failed to process CSV" });
    } finally {
        fs.unlink(filePath, () => { });
    }
});

/* ================= CSV PARSER ================= */
function parseCsvWithStreams(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        let headers = null;

        const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            const cols = splitCsvLine(trimmed);

            if (!headers) {
                headers = cols.map((h) => h.trim().toLowerCase());
                return;
            }

            const row = {};
            headers.forEach((key, i) => {
                row[key] = (cols[i] || "").trim();
            });

            const lead = {
                name: row.name || "",
                email: row.email || "",
                source: row.source || "",
                date: row.date ? new Date(row.date) : null,
                location: row.location || "",
                language: row.language || "",
                status: "ongoing",
                type: "warm",
                employeeId: null,
                assignedDate: null, // will be set later
            };

            if (!lead.name && !lead.email) return;

            results.push(lead);
        });

        rl.on("close", () => resolve(results));
        rl.on("error", reject);
        fileStream.on("error", reject);
    });
}

/* ================= CSV SPLIT ================= */
function splitCsvLine(line) {
    const cols = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            cols.push(current);
            current = "";
        } else {
            current += ch;
        }
    }

    cols.push(current);
    return cols;
}

/* ================= ADD LEAD ================= */
router.post("/add", addLead);

/* ================= GET ALL LEADS ================= */
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
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/my-leads/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;

        const leads = await Lead.find({ employeeId: employeeId })
            .sort({ assignedDate: -1 }); // latest first

        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/update-type/:id", async (req, res) => {
    try {
        const { type } = req.body;

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            { type },
            { new: true }
        );

        res.json(updatedLead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.put("/update-status/:id", async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) return res.status(404).json({ error: "Not found" });


        if (req.body.status === "closed" && lead.scheduledDate) {
            return res.status(400).json({
                error: "Lead will be auto-closed on scheduled time"
            });
        }

        lead.status = req.body.status;
        await lead.save();

        res.json(lead);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/update-schedule/:id", async (req, res) => {
    try {
        const { scheduledDate } = req.body;

        // ❗ prevent past scheduling
        if (new Date(scheduledDate) <= new Date()) {
            return res.status(400).json({
                error: "Scheduled time must be in the future"
            });
        }

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            {
                scheduledDate,
                status: "ongoing" // reset status when scheduling
            },
            { new: true }
        );

        res.json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/my-schedules", async (req, res) => {
    try {
        const employeeId = req.query.employeeId;
        const now = new Date();

        // ✅ auto-close expired leads
        await Lead.updateMany(
            {
                scheduledDate: { $lte: now },
                status: { $ne: "closed" }
            },
            {
                $set: { status: "closed" }
            }
        );

        const schedules = await Lead.find({
            employeeId,
            scheduledDate: { $gte: now }
        }).sort({ scheduledDate: 1 });

        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch schedules" });
    }
});

export default router;