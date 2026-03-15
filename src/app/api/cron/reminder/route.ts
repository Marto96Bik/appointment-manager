import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";
import { runCheckReminders } from "@/jobs/reminders";

/**
 * Vercel Cron invokes this route on the schedule defined in vercel.json.
 * Requests include Authorization: Bearer <CRON_SECRET> — validate it so only Vercel can trigger the job.
 *
 * Local test (with dev server running): curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/reminder
 */
function isAuthorizedCronRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}

export const GET = routeErrorHandler(async (req: NextRequest) => {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await runCheckReminders();
  return NextResponse.json({ ok: true, message: "Reminder job completed" });
});
