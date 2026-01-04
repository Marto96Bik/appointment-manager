import { NextResponse } from "next/server";
import { createPatient, getAllPatients } from "./patient.service";

export async function POST(req: Request) {
  const data = await req.json();
  const patient = createPatient(data);
  return Response.json(patient, { status: 201 });
}

export async function GET() {
  const patients = getAllPatients();
  return Response.json(patients);
}
