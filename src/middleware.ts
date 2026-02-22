import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt");

  if (!jwt && request.nextUrl.pathname.startsWith("/appointments")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (jwt && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/appointments", request.url));
  }

  return NextResponse.next();
}
