import { FastifyPluginAsync } from "fastify";
import os from "os";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prefix = "/api/v1/health";

const healthRoutes: FastifyPluginAsync = async (app) => {
  // Basic health check - lightweight, for load balancers
  app.get(`${prefix}`, async (req, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Detailed health check - includes all dependencies
  app.get(`${prefix}/detailed`, async (req, reply) => {
    const prisma: PrismaClient = (app as any).prisma;
    const redis: Redis = (app as any).redis;

    const checks = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
      },
      cpu: {
        model: os.cpus()[0]?.model,
        cores: os.cpus().length,
        loadAverage: os.loadavg(),
      },
      database: { status: "unknown", latency: 0 },
      cache: { status: "unknown", latency: 0 },
    };

    // Check database connectivity
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      checks.database.status = "ok";
      checks.database.latency = Date.now() - dbStart;
    } catch (error) {
      checks.database.status = "error";
      app.log.error({ error }, "Database health check failed");
    }

    // Check Redis connectivity
    try {
      const redisStart = Date.now();
      await redis.ping();
      checks.cache.status = "ok";
      checks.cache.latency = Date.now() - redisStart;
    } catch (error) {
      checks.cache.status = "error";
      app.log.error({ error }, "Redis health check failed");
    }

    const overallStatus =
      checks.database.status === "ok" && checks.cache.status === "ok"
        ? "healthy"
        : "degraded";

    return {
      status: overallStatus,
      ...checks,
    };
  });

  // Readiness check - for Kubernetes/container orchestration
  app.get(`${prefix}/ready`, async (req, reply) => {
    const prisma: PrismaClient = (app as any).prisma;
    const redis: Redis = (app as any).redis;

    try {
      await prisma.$queryRaw`SELECT 1`;
      await redis.ping();
      return { ready: true };
    } catch (error) {
      reply.code(503).send({ ready: false, error: "Dependencies not ready" });
    }
  });

  // Liveness check - for Kubernetes/container orchestration
  app.get(`${prefix}/live`, async (req, reply) => {
    return { alive: true };
  });

  // Metrics endpoint - basic Prometheus-style metrics
  app.get(`${prefix}/metrics`, async (req, reply) => {
    const prisma: PrismaClient = (app as any).prisma;

    reply.type('text/plain');

    try {
      // Count metrics from database
      const [portalCount, pageCount, userCount] = await Promise.all([
        prisma.portal.count(),
        prisma.page.count(),
        prisma.user.count(),
      ]);

      const metrics = [
        `# HELP portal_management_portals_total Total number of portals`,
        `# TYPE portal_management_portals_total gauge`,
        `portal_management_portals_total ${portalCount}`,
        ``,
        `# HELP portal_management_pages_total Total number of pages`,
        `# TYPE portal_management_pages_total gauge`,
        `portal_management_pages_total ${pageCount}`,
        ``,
        `# HELP portal_management_users_total Total number of users`,
        `# TYPE portal_management_users_total gauge`,
        `portal_management_users_total ${userCount}`,
        ``,
        `# HELP portal_management_uptime_seconds Application uptime in seconds`,
        `# TYPE portal_management_uptime_seconds gauge`,
        `portal_management_uptime_seconds ${process.uptime()}`,
        ``,
        `# HELP portal_management_memory_heap_used_bytes Heap memory used`,
        `# TYPE portal_management_memory_heap_used_bytes gauge`,
        `portal_management_memory_heap_used_bytes ${process.memoryUsage().heapUsed}`,
      ].join('\n');

      return metrics;
    } catch (error) {
      app.log.error({ error }, "Metrics endpoint failed");
      reply.code(500).send('# Error generating metrics');
    }
  });
};

export default healthRoutes;
