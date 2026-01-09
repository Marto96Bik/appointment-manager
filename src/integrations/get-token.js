const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");

const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline", // importante para obtener refresh_token
  scope: scopes,
});

console.log("Abrí este enlace en tu navegador:");
console.log(url);

// Después de autorizar, te dará un código. Pega aquí:
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Pega el código aquí: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("REFRESH_TOKEN =", tokens.refresh_token);
  console.log("Guárdalo en tu .env como REFRESH_TOKEN=1/xxxx");
  rl.close();
});
