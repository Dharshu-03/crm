import cron from "node-cron";
import Lead from "./models/leads.js";

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