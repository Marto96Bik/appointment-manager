import { NextRequest, NextResponse } from "next/server";
import { verifySession, sessionLogout } from "../../auth/auth.service";
import { deleteUser, findUserByUserId, updateUser } from "../user.service";
import { logger } from "@/lib/logger";
import { AppError } from "../../core/errors/appCustomError";
import { updateUserSchema } from "@/shared/schemas/user.schema";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const user = await findUserByUserId(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // user without sensitive data
    const safeUser = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
    };

    return NextResponse.json(safeUser, { status: 200 });
  } catch (e) {
    logger.error(e);
    if (e instanceof AppError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    const data = await req.json();

    updateUserSchema.parse(data); // Validación Zod
    const updatedUser = await updateUser(userId, data);

    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      phone: updatedUser.phone,
    };

    return NextResponse.json(safeUser, { status: 200 });
  } catch (e) {
    logger.error(e);
    if (e instanceof AppError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await verifySession(req);
    await deleteUser(userId);

    // Invalidar JWT cookie al eliminar
    await sessionLogout(userId);

    return NextResponse.json(
      { message: "User deleted successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": "jwt=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax",
        },
      },
    );
  } catch (e) {
    logger.error(e);
    if (e instanceof AppError) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
