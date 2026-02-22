import { NextRequest, NextResponse } from "next/server";
import {
  deleteAppointment,
  getAppointmentByEventId,
  updateAppointment,
} from "../appointment.service";
import { logger } from "../../../../lib/logger";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/appCustomError";
import { patchAppointmentSchema } from "../appointment.dto";
import { verifySession } from "../../auth/auth.service";

export async function GET(req: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  try {
    const userId = await verifySession(req);
    const { eventId } = await context.params;

    const appointment = await getAppointmentByEventId(userId, eventId);
    return NextResponse.json(appointment, { status: 200 });
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

export async function PATCH(req: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  try {
    const userId = await verifySession(req);
    const { eventId } = await context.params;
    const data = await req.json();

    patchAppointmentSchema.parse(data); // Validate input data
    const appointment = await updateAppointment(userId, eventId, data);
    return NextResponse.json(appointment, { status: 200 });
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
export async function DELETE(req: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  try {
    const userId = await verifySession(req);
    const { eventId } = await context.params;

    const appointment = await deleteAppointment(userId, eventId);
    return NextResponse.json(appointment, { status: 200 });
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
