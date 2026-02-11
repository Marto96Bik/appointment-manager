import { AppError } from "../core/errors/appCustomError";
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
}
