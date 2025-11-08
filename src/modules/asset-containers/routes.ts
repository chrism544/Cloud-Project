import { FastifyInstance } from "fastify";
import { z } from "zod";

const createAssetContainerSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  primaryFontUrl: z.string().url().optional(),
  backgroundImageUrl: z.string().url().optional(),
  cssOverrides: z.string().optional(),
  colorPrimary: z.string().optional(),
  colorSecondary: z.string().optional(),
  colorAccent: z.string().optional(),
  colorBackground: z.string().optional(),
  colorText: z.string().optional(),
});

const updateAssetContainerSchema = createAssetContainerSchema.partial();

export default async function assetContainerRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/asset-containers";

  app.get(prefix, async (_req, reply) => {
    const items = await app.prisma.assetContainer.findMany({ orderBy: { createdAt: "desc" } });
    reply.send(items);
  });

  app.post(prefix, async (req, reply) => {
    const body = createAssetContainerSchema.parse(req.body);
    const created = await app.prisma.assetContainer.create({ data: body });
    reply.code(201).send(created);
  });

  app.get(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await app.prisma.assetContainer.findUnique({ where: { id } });
    if (!item) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Asset container not found" } });
    reply.send(item);
  });

  app.patch(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = updateAssetContainerSchema.parse(req.body);
    const updated = await app.prisma.assetContainer.update({ where: { id }, data });
    reply.send(updated);
  });

  app.delete(`${prefix}/:id`, async (req, reply) => {
    const { id } = req.params as { id: string };
    await app.prisma.assetContainer.delete({ where: { id } });
    reply.code(204).send();
  });
}
