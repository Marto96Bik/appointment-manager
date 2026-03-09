import { NextRequest, NextResponse } from "next/server";
import { createPatient, getPatientsList } from "./patient.service";
import { createPatientSchema, getPatientSchema } from "@/schema/patient.schema";
import { verifySession } from "../auth/auth.service";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";

export const GET = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const filters = getPatientSchema.parse(params);

  const patients = await getPatientsList(userId, filters);
  return NextResponse.json(patients, { status: 200 });
});

export const POST = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const data = await req.json();
  createPatientSchema.parse(data);

  const patient = createPatient(userId, data);
  return NextResponse.json(patient, { status: 201 });
});
