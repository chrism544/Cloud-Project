import { FastifyInstance } from "fastify";
import { z } from "zod";

const createPortalSchema = z.object({
  name: z.string().min(1),
  subdomain: z.string().min(1),
  customDomain: z.string().url().optional(),
  assetContainerId: z.string().uuid().optional(),
});

const updatePortalSchema = createPortalSchema.partial();

export default async function portalRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/portals";

  app.get(prefix, async (_req, reply) => {
    const items = await app.prisma.portal.findMany({ orderBy: { createdAt: "desc" } });
    reply.send(items);
  });

  app.post(prefix, async (req, reply) => {
    const body = createPortalSchema.parse(req.body);
    const created = await app.prisma.portal.create({ data: body });
    reply.code(201).send(created);
  });

  app.get(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await app.prisma.portal.findUnique({ where: { id } });
    if (!item) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Portal not found" } });
    reply.send(item);
  });

  app.patch(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = updatePortalSchema.parse(req.body);
    const updated = await app.prisma.portal.update({ where: { id }, data });
    reply.send(updated);
  });

  app.delete(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    await app.prisma.portal.delete({ where: { id } });
    reply.code(204).send();
  });
}
