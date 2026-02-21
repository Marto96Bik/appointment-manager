import { NextRequest, NextResponse } from "next/server";
import { logger } from "../../../../lib/logger";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/appCustomError";
import { patchPatientSchema } from "../patient.dto";
import { deletePatient, updatePatient, getPatientById } from "../patient.service";
import { verifySession } from "../../auth/auth.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const patientId = Number(resolvedParams.id);

    const patient = await getPatientById(userId, patientId);
    return NextResponse.json(patient, { status: 200 });
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const patientId = Number(resolvedParams.id);

    const data = await req.json();
    patchPatientSchema.parse(data); // Validate input data

    const patient = await updatePatient(userId, patientId, data);
    return NextResponse.json(patient, { status: 200 });
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const patientId = Number(resolvedParams.id);

    const patient = await deletePatient(userId, patientId);
    return NextResponse.json(patient, { status: 200 });
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
