import { NextResponse } from "next/server";
import { createAppointment, getAllAppointments } from "./appointment.service";
import { createAppointmentSchema } from "./appointent.dto";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    createAppointmentSchema.parse(data); // Validation of input data
    const appointment = createAppointment(data);
    return Response.json(appointment, { status: 201 });
  } catch (e) {
    console.error(e); // TODO cambiar por logger
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function GET() {
  const appointments = getAllAppointments();
  return Response.json(appointments);
}
