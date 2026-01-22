const cron = require("node-cron");
const Log = require("../models/Log");

// ✅ Runs every minute to mark missed doses
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const overdue = await Log.find({
    status: "scheduled",
    scheduledAt: { $lt: now },
  });

  for (const log of overdue) {
    log.status = "missed";
    await log.save();
  }

  console.log("✅ Scheduler ran at", now.toLocaleTimeString());
});
