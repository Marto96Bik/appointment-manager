import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: { target: "pino-pretty" },
});

// usage in API route
export async function GET() {
  logger.info("Handling GET request");
  return NextResponse.json({ ok: true });
}
