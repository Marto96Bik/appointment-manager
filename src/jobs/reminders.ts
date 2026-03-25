/**
 * Run the reminder job locally (e.g. for testing).
 * Usage: npm run cron:reminder  (or npx tsx src/scripts/runReminder.ts)
 * Ensure .env is loaded (e.g. from project root where dotenv is applied).
 */
import "dotenv/config";

(async () => {
  try {
    await runCheckReminders();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

import {
  findAppointmentsToRemind,
  markReminderPending,
} from "@/app/api/appointment/appointment.service";

export async function runCheckReminders() {
  const appointments = await findAppointmentsToRemind();

  for (const appointment of appointments) {
    await markReminderPending(appointment.userId, appointment.id);
  }
}
