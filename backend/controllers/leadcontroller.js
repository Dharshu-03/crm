import Lead from "../models/leads.js";
import fs from "fs";


import Employee from "../models/employee.js";
import logActivity from "../utils/logActivity.js";
import mongoose from "mongoose";


export const addLead = async (req, res) => {
    try {
        const leadData = req.body;

        // 🔥 find employee with same language
        const employee = await Employee.findOne({
            language: { $regex: `^${leadData.language}$`, $options: "i" }
        });

        const lead = await Lead.create({
            ...leadData,

            // ✅ assign employee
            employeeId: employee ? employee._id : null,

            // ✅ ADD THIS 👇
            assignedDate: employee ? new Date() : null
        });

        res.status(201).json(lead);

        await logActivity(
            "lead_assigned",
            `Lead ${lead.name} assigned to employee`,
            new mongoose.Types.ObjectId(employee._id)
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add lead" });
    }
};