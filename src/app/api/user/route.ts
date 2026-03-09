import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../auth/auth.service";
import { deleteUser, findUserByUserId, updateUser } from "./user.service";
import { updateUserSchema } from "@/schema/user.schema";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";

export const GET = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const user = await findUserByUserId(userId);

  // user without sensitive data
  const safeUser = {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
  };

  return NextResponse.json(safeUser, { status: 200 });
});

export const PATCH = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const data = await req.json();

  updateUserSchema.parse(data);
  const updatedUser = await updateUser(userId, data);

  return NextResponse.json(updatedUser, { status: 200 });
});

export const DELETE = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  await deleteUser(userId);

  return NextResponse.json(
    { message: "User deleted successfully" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "jwt=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax",
      },
    },
  );
});
