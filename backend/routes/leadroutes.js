import express from "express";
import multer from "multer";
import Lead from "../models/leads.js";
import { addLead } from "../controllers/leadcontroller.js";
import fs from "fs";
import path from "path";
import readline from "readline";



const router = express.Router();
// Multer config — saves uploaded CSV to /tmp
const upload = multer({ dest: "/tmp/" });

router.post("/upload-csv", upload.single("csv"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    try {
        const leads = await parseCsvWithStreams(filePath);

        if (leads.length === 0) {
            return res.status(400).json({ error: "CSV is empty or has no valid rows" });
        }

        const result = await Lead.insertMany(leads, { ordered: false });

        res.json({
            message: `${result.length} leads imported successfully`,
            count: result.length,
        });
    } catch (err) {
        console.error("CSV upload error:", err);
        res.status(500).json({ error: "Failed to process CSV" });
    } finally {
        fs.unlink(filePath, () => { });
    }
});

function parseCsvWithStreams(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        let headers = null;

        const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity, // handles Windows \r\n line endings
        });

        rl.on("line", (line) => {
            const trimmed = line.trim();
            if (!trimmed) return; // skip blank lines

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
            };

            if (!lead.name && !lead.email) return; // skip empty rows

            results.push(lead);
        });

        rl.on("close", () => resolve(results));
        rl.on("error", reject);
        fileStream.on("error", reject);
    });
}

function splitCsvLine(line) {
    const cols = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // skip escaped quote
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

    cols.push(current); // push last field
    return cols;
}



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