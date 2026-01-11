import { NextResponse } from "next/server";
import { createAppointment, getAllAppointments } from "./appointment.service";
import { createAppointmentSchema } from "./appointent.dto";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    createAppointmentSchema.parse(data); // Validation of input data
    const appointment = await createAppointment(data);
    return Response.json(appointment, { status: 201 });
  } catch (e) {
    logger.error(e);
    if (e instanceof Error) {
      return NextResponse.json(e, { status: 400 });
    }
    return NextResponse.json(e, { status: 500 }); // TODO fix
  }
}

export async function GET() {
  const appointments = await getAllAppointments();
  return Response.json(appointments);
}
