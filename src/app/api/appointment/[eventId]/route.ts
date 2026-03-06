import { NextRequest, NextResponse } from "next/server";
import {
  deleteAppointment,
  getAppointmentByEventId,
  updateAppointment,
} from "../appointment.service";
import { patchAppointmentSchema } from "@/shared/schemas/appointment.schema";
import { verifySession } from "../../auth/auth.service";
import { routeErrorHandler } from "@/lib/http/routeErrorHandler";

export const GET = routeErrorHandler(
  async (req: NextRequest, context: { params: Promise<{ eventId: string }> }) => {
    const userId = await verifySession(req);
    const { eventId } = await context.params;

    const appointment = await getAppointmentByEventId(userId, eventId);
    return NextResponse.json(appointment, { status: 200 });
  },
);

export const PATCH = routeErrorHandler(
  async (req: NextRequest, context: { params: Promise<{ eventId: string }> }) => {
    const userId = await verifySession(req);
    const { eventId } = await context.params;
    const data = await req.json();
    patchAppointmentSchema.parse(data);
    
    const result = await updateAppointment(userId, eventId, data);
    return NextResponse.json(result, { status: 200 });
  },
);

export const DELETE = routeErrorHandler(
  async (req: NextRequest, context: { params: Promise<{ eventId: string }> }) => {
    const userId = await verifySession(req);
    const { eventId } = await context.params;

    const appointment = await deleteAppointment(userId, eventId);
    return NextResponse.json(appointment, { status: 200 });
  },
);
