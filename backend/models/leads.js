import mongoose from "mongoose";

const leadsSchema = new mongoose.Schema({
    name: String,
    email: String,
    source: String,
    date: Date,
    location: String,
    language: String,

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },

    status: {
        type: String,
        default: "ongoing"
    },

    type: {
        type: String,
        default: "warm"
    }
}, { timestamps: true });

export default mongoose.model("Lead", leadsSchema);