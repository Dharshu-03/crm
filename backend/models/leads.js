import mongoose from "mongoose";

const leadsSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    date: { type: Date, required: true },
    source: { type: String, required: true },
    location: { type: String, required: true },
    language: { type: String, required: true }
});

export default mongoose.model("Lead", leadsSchema);