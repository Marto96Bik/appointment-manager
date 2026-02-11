import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createUser, findUserByGoogleId } from "../../user/user.service";
import { randomUUID } from "crypto";
import { oauth2Client } from "../auth.client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  // Tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // UserData
  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const userData = ticket.getPayload()!;

  // Check user
  let user = await findUserByGoogleId(userData.sub);
  const sid = randomUUID();

  if (!user) {
    user = await createUser({
      name: userData.given_name!,
      lastname: userData.family_name!,
      email: userData.email!,
      phone: "",
      googleId: userData.sub,
      sid,
      refreshToken: tokens.refresh_token!,
    });
  } else {
    user.sid = sid;
    if (tokens.refresh_token) {
      user.refreshToken = tokens.refresh_token;
    }
    user.refreshToken = tokens.refresh_token!;
  }
  // Generate JWT
  const accessToken = jwt.sign(
    {
      googleId: user.googleId,
      sid,
    },
    process.env.SESSION_SECRET!,
    { expiresIn: "7d" },
  );

  // Redirect to Frontend: return NextResponse.redirect("http://localhost:3000/dashboard");
  return NextResponse.json({ accessToken, expiresIn: "7d" }, { status: 200 });
}
