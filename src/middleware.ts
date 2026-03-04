import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { findUserByGoogleId } from "./app/api/user/user.service";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);
const protectedRoutes = ["/appointments", "/account", "/patients"];

export async function middleware(req: NextRequest) {
  const jwtCookie = req.cookies.get("jwt")?.value;

  // If it's a protected route and no JWT → redirect to login
  const isProtected = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

  if (!jwtCookie) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const payload: any = (await jwtVerify(jwtCookie, secret)).payload;

    if (!payload.googleId || typeof payload.googleId !== "string") {
      // Invalid payload structure
      return redirectToLogin(req);
    }

    // Validate user still exists (Valid JWT but no user on db)
    const user = await findUserByGoogleId(payload.googleId);

    if (!user) {
      // Valid JWT but user deleted
      return redirectToLogin(req);
    }

    // Si intenta ir a login estando logueado → redirige
    if (req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/appointments", req.url));
    }
  } catch {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.delete("jwt");
  return response;
}

// Middleware Node runtime
export const config = {
  matcher: ["/appointments/:path*", "/account/:path*", "/patients/:path*"],
  runtime: "nodejs",
};
