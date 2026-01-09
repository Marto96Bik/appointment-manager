import { NextRequest, NextResponse } from "next/server";
import { getPatientById } from "../patient.service";
import { logger } from "../../../../lib/logger";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const patient = getPatientById(numericId);

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  return NextResponse.json(patient);
}
