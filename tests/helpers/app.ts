import Fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

let testApp: FastifyInstance | null = null;
let testPrisma: PrismaClient | null = null;
let testRedis: Redis | null = null;

export async function createTestApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // Disable logging in tests
  });

  // Initialize Prisma
  testPrisma = new PrismaClient();
  app.decorate("prisma", testPrisma);

  // Initialize Redis
  testRedis = new Redis(process.env.REDIS_URL);
  app.decorate("redis", testRedis);

  // Register plugins
  await app.register(import("@fastify/jwt"), {
    secret: process.env.JWT_SECRET!,
  });

  await app.register(import("@fastify/cors"), {
    origin: true,
  });

  // Register auth plugin
  await app.register(import("@/plugins/auth"));

  // Register routes
  await app.register(import("@/modules/auth/routes"));
  await app.register(import("@/modules/portals/routes"));
  await app.register(import("@/modules/pages/routes"));
  await app.register(import("@/modules/menus/routes"));
  await app.register(import("@/modules/asset-containers/routes"));

  testApp = app;
  return app;
}

export async function closeTestApp() {
  if (testApp) {
    await testApp.close();
    testApp = null;
  }
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
  if (testRedis) {
    testRedis.disconnect();
    testRedis = null;
  }
}

export function getTestPrisma(): PrismaClient {
  if (!testPrisma) {
    throw new Error("Test Prisma client not initialized");
  }
  return testPrisma;
}
