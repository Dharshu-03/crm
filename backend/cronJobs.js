import cron from "node-cron";
import Lead from "./models/leads.js";

import Attendance from "./models/attendance.js"; // adjust path if needed

// 🔥 Runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
    try {
        const today = new Date();

        // get today's start
        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        // delete today's attendance OR reset it
        await Attendance.deleteMany({
            date: { $gte: startOfToday }
        });

        console.log("Attendance reset for new day");

    } catch (err) {
        console.error("Reset error:", err);
    }
});

cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();

        const result = await Lead.updateMany(
            {
                scheduledDate: { $lte: now },
                status: { $ne: "closed" }
            },
            {
                $set: { status: "closed" }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Auto-closed ${result.modifiedCount} leads`);
        }

    } catch (err) {
        console.error("Cron error:", err);
    }
});