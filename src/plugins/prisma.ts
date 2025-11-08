import { PrismaClient } from "../generated/prisma/client";
import { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default async function prismaPlugin(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  app.decorate("prisma", prisma);
}
