import Redis from "ioredis";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    redis?: Redis;
  }
}

async function redisPlugin(app: FastifyInstance) {
  const url = process.env.REDIS_URL;
  if (!url) {
    app.log.warn("REDIS_URL not set; caching disabled");
    return;
  }
  const redis = new Redis(url);

  redis.on("error", (err) => app.log.error({ err }, "Redis error"));
  redis.on("connect", () => app.log.info("Redis connected"));

  app.addHook("onClose", async () => {
    await redis.quit();
  });

  app.decorate("redis", redis);
}

export default fp(redisPlugin);
