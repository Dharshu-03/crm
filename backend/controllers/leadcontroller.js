import Lead from "../models/leads.js";
import fs from "fs";



export const addLead = async (req, res) => {
    try {

        const lead = new Lead({
            ...req.body
        });
        await lead.save();
        res.status(201).json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};