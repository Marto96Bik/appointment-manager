import { handlePrismaError } from "@/lib/errors/prismaErrorHandler";
import { CreateUserDto, UpdateUserDto } from "@/schema/user.schema";
import prisma from "@/lib/database/prisma";
import { AppError } from "@/lib/errors/appCustomError";

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
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
