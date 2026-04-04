import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, unique: true },
    location: { type: String, required: true },
    language: { type: String, required: true }
});

export default mongoose.model("Employee", employeeSchema);