import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";
import { AppError } from "../../../lib/errors/appCustomError";
import { ZodError } from "zod";
import { verifySession } from "../auth/auth.service";
import { getCalendarEvents } from "./calendar.service";
import { getCalendarSchema } from "@/app/api/calendar/calendar.schema";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const { start, end } = getCalendarSchema.parse(params); // Validate input data

    const events = await getCalendarEvents(userId, start, end);
    return NextResponse.json(events, { status: 200 });
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
