import pino from "pino";

let logger;

if (process.env.NODE_ENV === "production") {
  logger = pino();
} else {
  logger = pino({
    transport: {
      target: "pino-pretty",
    },
  });
}

export { logger };
