import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AppError } from "../core/errors/appCustomError";
import { findUserByGoogleId, findUserByUserId } from "../user/user.service";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function verifySession(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Missing authorization token", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  let payload: { googleId: string; sid: string };
  try {
    ({ payload } = await jwtVerify(token, secret));
  } catch {
    throw new AppError("Invalid or expired session", 401);
  }

  const user = findUserByGoogleId(payload.googleId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.sid !== payload.sid) {
    throw new AppError("Closed session", 401);
  }

  return user.id;
}

export async function sessionLogout(userId: number) {
  const user = findUserByUserId(userId);
  user.sid = "";
  return user;
}
