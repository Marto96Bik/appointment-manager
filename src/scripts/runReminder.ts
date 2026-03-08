/**
 * Run the reminder job locally (e.g. for testing).
 * Usage: npm run cron:reminder  (or npx tsx src/scripts/runReminder.ts)
 * Ensure .env is loaded (e.g. from project root where dotenv is applied).
 */
import "dotenv/config";
import { runReminderJob } from "@/jobs/reminder.job";

(async () => {
  try {
    await runReminderJob();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
