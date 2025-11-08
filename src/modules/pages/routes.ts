import { FastifyInstance } from "fastify";
import { z } from "zod";

const createPageSchema = z.object({
  portalId: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.any(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  isPublished: z.boolean().optional(),
});

const updatePageSchema = createPageSchema.partial();

export default async function pageRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/pages";

  app.get(prefix, async (req, reply) => {
    const { portal_id, limit = 20, offset = 0 } = req.query as any;

    const where = portal_id ? { portalId: String(portal_id) } : {};

    // Cache key
    const cacheKey = portal_id ? `portal:${portal_id}:pages:${limit}:${offset}` : undefined;
    if (app.redis && cacheKey) {
      const cached = await app.redis.get(cacheKey);
      if (cached) return reply.send(JSON.parse(cached));
    }

    const items = await app.prisma.page.findMany({ where, skip: Number(offset), take: Number(limit), orderBy: { createdAt: "desc" } });

    if (app.redis && cacheKey) {
      await app.redis.set(cacheKey, JSON.stringify(items), "EX", 300); // 5 min
    }

    reply.send(items);
  });

  app.post(prefix, async (req, reply) => {
    const data = createPageSchema.parse(req.body);
    const created = await app.prisma.page.create({ data });
    // Invalidate cache for portal pages
    if (app.redis) {
      await app.redis.keys(`portal:${data.portalId}:pages:*`).then(keys => keys.length && app.redis!.del(keys));
    }
    reply.code(201).send(created);
  });

  app.get(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await app.prisma.page.findUnique({ where: { id } });
    if (!item) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Page not found" } });
    reply.send(item);
  });

  app.patch(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = updatePageSchema.parse(req.body);
    const updated = await app.prisma.page.update({ where: { id }, data });
    if (app.redis && updated.portalId) {
      await app.redis.keys(`portal:${updated.portalId}:pages:*`).then(keys => keys.length && app.redis!.del(keys));
    }
    reply.send(updated);
  });

  app.delete(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const deleted = await app.prisma.page.delete({ where: { id } });
    if (app.redis && deleted.portalId) {
      await app.redis.keys(`portal:${deleted.portalId}:pages:*`).then(keys => keys.length && app.redis!.del(keys));
    }
    reply.code(204).send();
  });
}
