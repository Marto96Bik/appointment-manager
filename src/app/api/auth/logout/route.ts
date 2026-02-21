import { NextRequest, NextResponse } from "next/server";
import { sessionLogout, verifySession } from "../auth.service";
import { logger } from "../../../../lib/logger";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/appCustomError";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const user = sessionLogout(userId);
    return NextResponse.json(user, { status: 200 });
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
