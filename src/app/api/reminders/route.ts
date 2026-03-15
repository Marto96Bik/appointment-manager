import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";
import { verifySession } from "../auth/auth.service";
import { findAppointmentReminderPending } from "../appointment/appointment.service";

export const GET = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const appoitnemtsToRemind = await findAppointmentReminderPending(userId);
  return NextResponse.json(appoitnemtsToRemind, { status: 200 });
});
