import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import leadroutes from "./routes/leadroutes.js";
import employeeroutes from "./routes/employeeroutes.js"
import attendanceRoutes from "./routes/attendanceroutes.js";

import Employee from "./models/employee.js";
import bcrypt from "bcrypt";

const createDefaultAdmin = async () => {
    const adminExists = await Employee.findOne({ role: "admin" });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        await Employee.create({
            fname: "Admin",
            lname: "User",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            status: "Active",
            location: "HQ",
            language: "English"
        });

        console.log("✅ Default admin created");
    } else {
        console.log("✅ Admin already exists");
    }
};

createDefaultAdmin();

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/attendance", attendanceRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch(err => console.log(err));

app.use("/api/leads", leadroutes);
app.use("/api/employees", employeeroutes);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));