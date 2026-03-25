import { AppError } from "@/lib/errors/appCustomError";

export function handlePrismaError(error: any): never {
  if (error.code === "P2002") {
    throw new AppError("Record with this data already exist", 409);
  }

  if (error.code === "P2025") {
    throw new AppError("Record not found", 404);
  }

  throw error;
}
