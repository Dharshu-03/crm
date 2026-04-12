import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);