import { NextRequest, NextResponse } from "next/server";
import { sessionLogout, verifySession } from "../auth.service";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";

export const POST = routeErrorHandler(async (req: NextRequest) => {
  const userId = await verifySession(req);
  const user = sessionLogout(userId);
  const response = NextResponse.json({ user, status: 200 });

  response.cookies.set("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
});
