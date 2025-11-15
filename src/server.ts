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
import adminRoutes from "@modules/admin/routes";
import authPlugin from "@plugins/auth";
import healthRoutes from "@modules/health/routes";
import builderRoutes from "@modules/builder/routes";

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
    await adminRoutes(instance);
    const analyticsRoutes = await import("@modules/analytics/routes").then(m => m.default);
    await analyticsRoutes(instance);
    await healthRoutes(instance, {});
    const storageRoutes = await import("@modules/storage/routes").then(m => m.default);
    await storageRoutes(instance);
    await instance.register(builderRoutes, { prefix: '/api/v1/builder' });
  });

  // Global error handler
  registerErrorHandler(app);

  // Root route - API status page
  app.get("/", async (req, reply) => {
    reply.type("text/html");
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portal Management API - Online</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 48px;
            max-width: 600px;
            width: 100%;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          h1 {
            font-size: 32px;
            color: #1f2937;
            margin-bottom: 12px;
          }
          p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 32px;
          }
          .links {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .link-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
            text-decoration: none;
            color: #1f2937;
            transition: all 0.2s;
          }
          .link-item:hover {
            background: #f3f4f6;
            transform: translateX(4px);
          }
          .link-label {
            font-weight: 500;
          }
          .link-url {
            color: #6366f1;
            font-size: 14px;
          }
          .footer {
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>API ONLINE</span>
          </div>

          <h1>Portal Management API</h1>
          <p>The API is running and ready to handle requests. Access the resources below to interact with the system.</p>

          <div class="links">
            <a href="/api/v1/health" class="link-item">
              <span class="link-label">Health Check</span>
              <span class="link-url">/api/v1/health</span>
            </a>

            <a href="/api/v1/health/detailed" class="link-item">
              <span class="link-label">Detailed System Status</span>
              <span class="link-url">/api/v1/health/detailed</span>
            </a>

            <a href="/docs" class="link-item">
              <span class="link-label">API Documentation</span>
              <span class="link-url">/docs</span>
            </a>
          </div>

          <div class="footer">
            Portal Management System &bull; ${new Date().getFullYear()}
          </div>
        </div>
      </body>
      </html>
    `;
  });

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

