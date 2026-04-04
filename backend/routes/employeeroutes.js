import express from "express";
import multer from "multer";
import Employee from "../models/employee.js"
import { addEmployee } from "../controllers/employeecontroller.js";
const router = express.Router();

router.post("/add", addEmployee);

export default router;