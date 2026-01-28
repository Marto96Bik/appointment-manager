import { NextRequest, NextResponse } from "next/server";
import { getAppointmentById } from "../appointment.service";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const Appointment = getAppointmentById(numericId);

  if (!Appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json(Appointment);
}
