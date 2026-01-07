import { NextResponse } from "next/server";
import { createPatient, getAllPatients } from "./patient.service";
import { createPatientSchema } from "./patient.dto";
import { logger } from "../../../lib/logger";

export async function POST(req: Request) {
  logger.info("Handling patient POST request");
  const data = await req.json();
  try {
    createPatientSchema.parse(data); // Validation of input data
    const patient = createPatient(data);
    return NextResponse.json(patient, { status: 201 });
  } catch (e) {
    logger.error({ e }, "An error occurred during operation");
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function GET() {
  logger.info("Handling patient GET request");
  const patients = getAllPatients();
  return NextResponse.json(patients);
}
