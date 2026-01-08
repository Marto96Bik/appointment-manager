import { NextResponse } from "next/server";
import { createPatient, getAllPatients } from "./patient.service";
import { createPatientSchema } from "./patient.dto";
import { logger } from "../../../lib/logger";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    createPatientSchema.parse(data); // Validation of input data
    const patient = createPatient(data);
    return NextResponse.json(patient, { status: 201 });
  } catch (e) {
    logger.error(e);
    if (e instanceof Error) {
      return NextResponse.json(e, { status: 400 });
    }
    return NextResponse.json(e, { status: 500 }); // TODO fix
  }
}

export async function GET() {
  const patients = getAllPatients();
  return NextResponse.json(patients);
}
