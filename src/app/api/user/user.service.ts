import { AppError } from "../core/errors/appCustomError";
import { CreateUserDto, UpdateUserDto } from "../../../shared/schemas/user.schema";
import prisma from "@/lib/prisma";

/* Create */
export function createUser(data: CreateUserDto) {
  try {
    return prisma.user.create({ data });
  } catch (error: any) {
    handlePrismaError(error);
  }
}

/* Read */
export async function findUserByUserId(userId: number) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function findUserByGoogleId(googleId: string) {
  try {
    return await prisma.user.findUnique({
      where: { googleId },
    });
  } catch (error: any) {
    handlePrismaError(error);
  }
}

/* Update */
export async function updateUser(userId: number, data: UpdateUserDto) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  } catch (error: any) {
    handlePrismaError(error);
  }
}

/* Delete */
export async function deleteUser(userId: number) {
  try {
    return await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error: any) {
    handlePrismaError(error);
  }
}

/* Helper */
function handlePrismaError(error: any): never {
  if (error.code === "P2002") {
    throw new AppError("Record with this data already exist", 409);
  }

  if (error.code === "P2025") {
    throw new AppError("Record not found", 404);
  }

  throw error;
}
