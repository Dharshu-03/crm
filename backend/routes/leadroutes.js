import express from "express";
import multer from "multer";
import Lead from "../models/leads.js";
import { addLead } from "../controllers/leadcontroller.js";
const router = express.Router();

router.post("/add", addLead);

export default router;