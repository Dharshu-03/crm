import Activity from "../models/activity.js";

const logActivity = async (type, message, employeeId = null) => {
    try {
        await Activity.create({ type, message, employeeId });
    } catch (err) {
        console.error("Activity log failed:", err);
    }
};

export default logActivity;