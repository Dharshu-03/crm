import Activity from "../models/activity.js";

const logActivity = async (type, message) => {
    try {
        await Activity.create({ type, message });
    } catch (err) {
        console.error("Activity log failed:", err);
    }
};

export default logActivity;