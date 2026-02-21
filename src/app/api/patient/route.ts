import { NextRequest, NextResponse } from "next/server";
import { createPatient, getPatientsList } from "./patient.service";
import { createPatientSchema, getPatientSchema } from "./patient.dto";
import { logger } from "../../../lib/logger";
import { AppError } from "../core/errors/appCustomError";
import { ZodError } from "zod";
import { verifySession } from "../auth/auth.service";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const data = await req.json();
    createPatientSchema.parse(data); // Validate input data

    const patient = createPatient(userId, data);
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

export async function GET(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const filters = getPatientSchema.parse(params); // Validate input data

    const patients = getPatientsList(userId, filters);
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
