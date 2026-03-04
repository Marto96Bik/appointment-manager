import { runReminderJob } from "@/jobs/reminder.job";

async function main() {
  try {
    await runReminderJob();
    process.exit(0);
  } catch (error) {
    console.error("Reminder job failed:", error);
    process.exit(1);
  }
}

main();
