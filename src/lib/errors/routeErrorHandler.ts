import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors/appCustomError";
import { logger } from "@/lib/utils/logger";

export function routeErrorHandler<T extends (...args: any[]) => Promise<Response>>(handler: T) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args);
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
  };
}
