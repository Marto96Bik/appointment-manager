import { NextResponse } from "next/server";
import { createOAuthClient } from "../../../../integrations/google-auth.client";

export async function GET() {
  const url = createOAuthClient.generateAuthUrl({
    access_type: "offline", // Vital para el refresh_token
    prompt: "consent", // Fuerza a Google a mostrar la pantalla de permiso y dar el refresh_token
    scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar.events"],
  });

  return NextResponse.redirect(url);
}
