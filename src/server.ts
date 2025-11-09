import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import staticPlugin from "@fastify/static";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@utils/logger";
import { registerErrorHandler } from "@utils/errors";
import prismaPlugin from "@plugins/prisma";
import redisPlugin from "@plugins/redis";
import portalRoutes from "@modules/portals/routes";
import assetContainerRoutes from "@modules/asset-containers/routes";
import pageRoutes from "@modules/pages/routes";
import menuRoutes from "@modules/menus/routes";
import authRoutes from "@modules/auth/routes";
import authPlugin from "@plugins/auth";

// Load environment variables from .env if present
dotenv.config();

async function buildServer() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
      transport: process.env.NODE_ENV === "production" ? undefined : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname"
        }
      }
    }
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

  // Swagger
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Portal Management API",
        version: "0.1.0",
      },
    },
  });
  await app.register(swaggerUI, { routePrefix: "/docs" });

  // Plugins
  await app.register(prismaPlugin);
  await app.register(redisPlugin);
  await app.register(authPlugin);

  // Serve local uploads if configured
  const uploadsPath = process.env.STORAGE_LOCAL_PATH || "uploads";
  const uploadsUrl = process.env.STORAGE_LOCAL_URL || "/uploads";
  await app.register(staticPlugin, { root: path.resolve(uploadsPath), prefix: "/uploads/" });

  // Routes
  await app.register(async (instance) => {
    await authRoutes(instance);
    await portalRoutes(instance);
    await assetContainerRoutes(instance);
    await pageRoutes(instance);
    await menuRoutes(instance);
    const storageRoutes = await import("@modules/storage/routes").then(m => m.default);
    await storageRoutes(instance);
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

