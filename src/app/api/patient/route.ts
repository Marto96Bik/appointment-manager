import { NextRequest, NextResponse } from "next/server";
import { createPatient, getPatientsList } from "./patient.service";
import { createPatientSchema, getPatientSchema } from "./patient.dto";
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

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const filters = getPatientSchema.parse(params);
    const patients = getPatientsList(filters);
    return NextResponse.json(patients, { status: 200 });
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
