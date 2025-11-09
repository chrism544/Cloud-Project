import { PrismaClient } from "../generated/prisma";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

async function prismaPlugin(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  app.decorate("prisma", prisma);
}

export default fp(prismaPlugin);
