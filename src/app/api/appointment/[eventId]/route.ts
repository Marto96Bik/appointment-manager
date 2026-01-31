import { NextRequest, NextResponse } from "next/server";
import { editAppointment, getAppointmentByEventId } from "../appointment.service";
import { logger } from "@/lib/logger";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/appCustomError";
import { putAppointmentSchema } from "../appointment.dto";

export async function GET(req: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await context.params;

    const appointment = await getAppointmentByEventId(eventId);

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (e) {
    console.log(e);
    logger.error(e);

    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          issues: e.issues,
        },
        { status: 400 },
      );
    }

    if (e instanceof AppError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params;
  const data = await req.json();
  try {
    putAppointmentSchema.parse(data); // Validation of input data
    const appointment = await editAppointment(eventId, data);
    return NextResponse.json(appointment, { status: 201 });
  } catch (e) {
    console.log(e);
    logger.error(e);

    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          issues: e.issues,
        },
        { status: 400 },
      );
    }

    if (e instanceof AppError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params;
  const data = await req.json();
  try {
    putAppointmentSchema.parse(data); // Validation of input data
    const appointment = await editAppointment(eventId, data);
    return NextResponse.json(appointment, { status: 201 });
  } catch (e) {
    console.log(e);
    logger.error(e);

    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          issues: e.issues,
        },
        { status: 400 },
      );
    }

    if (e instanceof AppError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
