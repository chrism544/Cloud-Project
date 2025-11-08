import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
import { logger } from "@utils/logger";
import { registerErrorHandler } from "@utils/errors";

// Load environment variables from .env if present
dotenv.config();

async function buildServer() {
  const app = Fastify({
    logger
  });

  // Global plugins
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  await app.register(helmet, { global: true });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  // Health endpoint
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Global error handler
  registerErrorHandler(app);

  return app;
}

async function start() {
  const app = await buildServer();
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info({ port, host }, "Server listening");
  } catch (err) {
    app.log.error(err, "Failed to start server");
    process.exit(1);
  }
}

// Start server when executed directly
start();

