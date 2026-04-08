import { AppError } from "@/lib/errors/appCustomError";
import { google } from "googleapis";

const url = process.env.APP_URL;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!url || !redirectUri) {
  throw new AppError("Missing system configuration data", 500);
}

const redirectUrl = url + redirectUri;

export const createOAuthClient = () => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl,
  );
  return client;
};

export const createOAuthClientWithToken = (refreshToken: string) => {
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  return client;
};
