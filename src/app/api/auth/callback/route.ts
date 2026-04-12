import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { createUser, findUserByGoogleId } from "../../user/user.service";
import { createOAuthClient } from "@/integrations/google-auth.client";
import prisma from "@/lib/database/prisma";
import { routeErrorHandler } from "@/lib/errors/routeErrorHandler";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export const GET = routeErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  // Tokens
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // UserData
  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const userData = ticket.getPayload()!;

  // Check user
  const baseUrl = process.env.APP_URL!;
  let redirectUrl = `${baseUrl}/`;
  let user = await findUserByGoogleId(userData.sub);
  const sid = crypto.randomUUID();

  if (!user) {
    user = await createUser({
      name: userData.given_name!,
      lastname: userData.family_name!,
      email: userData.email!,
      phone: null,
      googleId: userData.sub,
      sid,
      refreshToken: tokens.refresh_token!,
    });
    redirectUrl = `${baseUrl}/register`;
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        sid,
        refreshToken: tokens.refresh_token ?? user.refreshToken,
      },
    });
  }
  // Generate JWT
  const accessToken = await new SignJWT({
    googleId: user.googleId,
    sid,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("jwt", accessToken, {
    /*httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",*/
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return response;
});
