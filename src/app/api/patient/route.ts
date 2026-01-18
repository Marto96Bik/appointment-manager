import { NextResponse } from "next/server";
import { createPatient, getAllPatients } from "./patient.service";
import { createPatientSchema } from "./patient.dto";
import { logger } from "../../../lib/logger";
import { AppError } from "../core/errors/appCustomError";
import { ZodError } from "zod";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    createPatientSchema.parse(data); // Validation of input data
    const patient = createPatient(data);
    return NextResponse.json(patient, { status: 201 });
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

export async function GET() {
  const patients = getAllPatients();
  return NextResponse.json(patients);
}
