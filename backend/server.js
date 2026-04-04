import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import leadroutes from "./routes/leadroutes.js";
import employeeroutes from "./routes/employeeroutes.js"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch(err => console.log(err));

// ✅ Routes
app.use("/api/leads", leadroutes);
app.use("/api/employees", employeeroutes);



// ✅ Serve React build
app.use(express.static(path.join(__dirname, "build")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));