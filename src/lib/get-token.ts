// run: npx tsx .\src\lib\get-token.ts
import { google } from "googleapis";
import * as readline from "readline/promises";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en .env");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");

const scopes = ["https://www.googleapis.com/auth/calendar"];

async function main() {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  console.log("Abre este enlace y autoriza:\n", url);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question("Pega el código aquí: ");
  rl.close();

  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\nÉxito! REFRESH_TOKEN:", tokens.refresh_token);
    console.log("Agregalo a .env.local como GOOGLE_REFRESH_TOKEN=...");
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
