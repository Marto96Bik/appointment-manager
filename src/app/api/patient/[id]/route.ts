import { NextRequest, NextResponse } from "next/server";
import { patchPatientSchema } from "@/shared/schemas/patient.schema";
import { deletePatient, updatePatient, getPatientById } from "../patient.service";
import { verifySession } from "../../auth/auth.service";
import { routeErrorHandler } from "@/lib/http/routeErrorHandler";

export const GET = routeErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const patientId = Number(resolvedParams.id);

    const patient = await getPatientById(userId, patientId);
    return NextResponse.json(patient, { status: 200 });
  },
);

export const PATCH = routeErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const patientId = Number(resolvedParams.id);

    const data = await req.json();
    patchPatientSchema.parse(data);

    const patient = await updatePatient(userId, patientId, data);
    return NextResponse.json(patient, { status: 200 });
  },
);

export const DELETE = routeErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const userId = await verifySession(req);
    const resolvedParams = await params;
    const patientId = Number(resolvedParams.id);

    const patient = await deletePatient(userId, patientId);
    return NextResponse.json(patient, { status: 200 });
  },
);
