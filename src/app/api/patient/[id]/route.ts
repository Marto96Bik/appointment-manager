import { NextRequest, NextResponse } from "next/server";
import { logger } from "../../../../lib/logger";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/appCustomError";
import { patchPatientSchema } from "../patient.dto";
import { editPatient } from "../patient.service";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const patientId = Number(id);
    const data = await req.json();

    patchPatientSchema.parse(data); // Validation of input data

    const patient = await editPatient(patientId, data);

    return NextResponse.json(patient, { status: 200 });
  } catch (e) {
    console.log(e);
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
