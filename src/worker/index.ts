import cron from "node-cron";
import { runReminderJob } from "@/jobs/reminder.job";

console.log("Reminder worker started");

// "0 * * * *" sets the schedule to run the task every hour, at minute 0.
cron.schedule("0 * * * *", async () => {
  await runReminderJob();
});
