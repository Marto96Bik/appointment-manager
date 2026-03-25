import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../auth/auth.service";
import { markReminderSent } from "../../appointment/appointment.service";

export const PATCH = routeErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const appointment = markReminderSent(userId, eventId);
    return NextResponse.json(appointment, { status: 200 });
  },
);
