import { NextResponse } from "next/server";
import { createPatient, getAllPatients } from "./patient.service";
import { createPatientSchema } from "./patient.dto";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    createPatientSchema.parse(data); // Validation of input data
    const patient = createPatient(data);
    return Response.json(patient, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function GET() {
  const patients = getAllPatients();
  return Response.json(patients);
}
