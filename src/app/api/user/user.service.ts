import { AppError } from "../core/errors/appCustomError";
<<<<<<< HEAD
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
=======
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.model";
import { inMemoryStore } from "@/lib/inMemoryStore";

export function createUser(data: CreateUserDto) {
  if (userExists(data.email)) {
    throw new AppError("User already exist", 409);
  }

  const newUser = {
    id: inMemoryStore.users.length + 1,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryStore.users.push(newUser);
  console.log(newUser);
  return newUser;
}

export function getUsers() {
  return inMemoryStore.users;
}

export function findUserByUserId(userId: number) {
  const user = inMemoryStore.users.find((u) => u.id === userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

export function findUserByGoogleId(googleId: string): User | undefined {
  const user = inMemoryStore.users.find((u) => u.googleId === googleId);
  return user;
}

export function updateUser(userId: number, data: UpdateUserDto) {
  const index = getIndexByUserId(userId);
  const user = inMemoryStore.users[index];

  const updatedUser: User = {
    ...user,
    name: data.name ?? user.name,
    lastname: data.lastname ?? user.lastname,
    email: data.email ?? user.email,
    phone: data.phone ?? user.phone,
    updatedAt: new Date(),
  };
  inMemoryStore.users[index] = updatedUser;
  return updatedUser;
}

export function deleteUser(userId: number, refreshToken: string) {
  const index = getIndexByUserId(userId);
  const deletedUser = inMemoryStore.users[index];
  inMemoryStore.users.splice(index, 1);
  return deletedUser;
}

function userExists(googleId: string) {
  return inMemoryStore.users.some((u) => u.googleId === googleId);
}

function getIndexByUserId(id: number) {
  const index = inMemoryStore.users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new AppError("User not found", 404);
  }
  return index;
>>>>>>> origin/dev
}
