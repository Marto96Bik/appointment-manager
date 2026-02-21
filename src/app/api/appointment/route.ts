import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAppointments } from "./appointment.service";
import { createAppointmentSchema, getAppointmentSchema } from "./appointment.dto";
import { logger } from "@/lib/logger";
import { AppError } from "../core/errors/appCustomError";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    createAppointmentSchema.parse(data); // Validation of input data
    const appointment = await createAppointment(data);
    return NextResponse.json(appointment, { status: 201 });
  } catch (e) {
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawParams = {
    startDate: searchParams.get("startDate") ?? undefined,
    patientId: searchParams.get("patientId") ?? undefined,
  };

  const params = getAppointmentSchema.parse(rawParams);

  const appointments = await getAppointments(params);
  return NextResponse.json(appointments, { status: 200 });
}
