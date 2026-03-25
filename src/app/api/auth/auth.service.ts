import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AppError } from "../../../lib/errors/appCustomError";
import { findUserByGoogleId, findUserByUserId } from "../user/user.service";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function verifySession(req: NextRequest) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    throw new AppError("Missing session", 401);
  }

  let payload: { googleId: string; sid: string };
  try {
    ({ payload } = await jwtVerify(jwt, secret));
  } catch {
    throw new AppError("Invalid or expired session", 401);
  }

  const user = await findUserByGoogleId(payload.googleId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.sid !== payload.sid) {
    throw new AppError("Closed session", 401);
  }

  return user.id;
}

export async function sessionLogout(userId: number) {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.sid = "";
  return user;
}
