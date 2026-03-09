import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAppointments } from "./appointment.service";
import { createAppointmentSchema, getAppointmentSchema } from "@/schema/appointment.schema";
import { verifySession } from "../auth/auth.service";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";

export const GET = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const params = Object.fromEntries(req.nextUrl.searchParams);
  getAppointmentSchema.parse(params);

  const appointments = await getAppointments(userId, params);
  return NextResponse.json(appointments, { status: 200 });
});

export const POST = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const data = await req.json();
  createAppointmentSchema.parse(data);

  const result = await createAppointment(userId, data);
  return NextResponse.json(result, { status: 201 });
});
