import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAppointments } from "./appointment.service";
import { createAppointmentSchema, getAppointmentSchema } from "./appointment.dto";
import { logger } from "../../../lib/logger";
import { AppError } from "../core/errors/appCustomError";
import { ZodError } from "zod";
import { verifySession } from "../auth/auth.service";

<<<<<<< HEAD
export async function GET(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const filters = getAppointmentSchema.parse(params); // Validate input data

    const appointments = await getAppointments(userId, filters);
    return NextResponse.json(appointments, { status: 200 });
=======
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    createAppointmentSchema.parse(data); // Validation of input data
    const appointment = await createAppointment(data);
    return NextResponse.json(appointment, { status: 201 });
>>>>>>> 2e85b92 (feat: wrap logic in try-catch)
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

export async function POST(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const data = await req.json();
    createAppointmentSchema.parse(data); // Validate input data

    const appointment = await createAppointment(userId, data);
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
