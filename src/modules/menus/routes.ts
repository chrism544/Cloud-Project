import { FastifyInstance } from "fastify";
import { z } from "zod";

const createMenuSchema = z.object({
  portalId: z.string().uuid(),
  name: z.string().min(1),
  location: z.string().min(1),
});

const updateMenuSchema = createMenuSchema.partial();

const createMenuItemSchema = z.object({
  parentId: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  linkUrl: z.string().min(1),
  icon: z.string().optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  isVisible: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  requiredRole: z.string().optional(),
});

const updateMenuItemSchema = createMenuItemSchema.partial();

export default async function menuRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/menus";

  app.get(prefix, async (req, reply) => {
    const { portal_id, limit = 20, offset = 0 } = req.query as any;
    const where = portal_id ? { portalId: String(portal_id) } : {};

    const cacheKey = portal_id ? `portal:${portal_id}:menus:${limit}:${offset}` : undefined;
    if (app.redis && cacheKey) {
      const cached = await app.redis.get(cacheKey);
      if (cached) return reply.send(JSON.parse(cached));
    }

    const items = await app.prisma.menu.findMany({ where, skip: Number(offset), take: Number(limit), orderBy: { createdAt: "desc" } });

    if (app.redis && cacheKey) await app.redis.set(cacheKey, JSON.stringify(items), "EX", 300);

    reply.send(items);
  });

  app.post(prefix, async (req, reply) => {
    const data = createMenuSchema.parse(req.body);
    const created = await app.prisma.menu.create({ data });
    if (app.redis) await app.redis.keys(`portal:${data.portalId}:menus:*`).then(keys => keys.length && app.redis!.del(keys));
    reply.code(201).send(created);
  });

  app.get(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await app.prisma.menu.findUnique({ where: { id }, include: { items: true } });
    if (!item) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Menu not found" } });
    reply.send(item);
  });

  app.patch(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = updateMenuSchema.parse(req.body);
    const updated = await app.prisma.menu.update({ where: { id }, data });
    if (app.redis) await app.redis.keys(`portal:${updated.portalId}:menus:*`).then(keys => keys.length && app.redis!.del(keys));
    reply.send(updated);
  });

  app.delete(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const deleted = await app.prisma.menu.delete({ where: { id } });
    if (app.redis) await app.redis.keys(`portal:${deleted.portalId}:menus:*`).then(keys => keys.length && app.redis!.del(keys));
    reply.code(204).send();
  });

  // Menu Items
  app.get(`${prefix}/:menuId/items`, async (req, reply) => {
    const { menuId } = req.params as { menuId: string };
    const items = await app.prisma.menuItem.findMany({ where: { menuId }, orderBy: { displayOrder: "asc" } });
    reply.send(items);
  });

  app.post(`${prefix}/:menuId/items`, async (req, reply) => {
    const { menuId } = req.params as { menuId: string };
    const data = createMenuItemSchema.parse(req.body);
    const created = await app.prisma.menuItem.create({ data: { ...data, menuId } });
    reply.code(201).send(created);
  });

  app.get(`${prefix}/:menuId/items/:itemId`, async (req, reply) => {
    const { itemId } = req.params as { menuId: string; itemId: string };
    const item = await app.prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!item) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Menu item not found" } });
    reply.send(item);
  });

  app.patch(`${prefix}/:menuId/items/:itemId`, async (req, reply) => {
    const { itemId } = req.params as { menuId: string; itemId: string };
    const data = updateMenuItemSchema.parse(req.body);
    const updated = await app.prisma.menuItem.update({ where: { id: itemId }, data });
    reply.send(updated);
  });

  app.delete(`${prefix}/:menuId/items/:itemId`, async (req, reply) => {
    const { itemId } = req.params as { menuId: string; itemId: string };
    await app.prisma.menuItem.delete({ where: { id: itemId } });
    reply.code(204).send();
  });
}
