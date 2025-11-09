import { FastifyInstance } from "fastify";
import { z } from "zod";

const trackSchema = z.object({
  event: z.string().min(1),
  pageId: z.string().uuid().optional(),
  portalId: z.string().uuid(),
  sessionId: z.string().optional(),
  timestamp: z.string().optional(),
  metadata: z.any().optional(),
});

export default async function analyticsRoutes(app: FastifyInstance) {
  // Track page events (public for now, but can be protected via API key in future)
  app.post("/api/v1/analytics/track", async (req, reply) => {
    const body = trackSchema.parse(req.body);
    if (body.event === "page_view" && body.pageId) {
      // Upsert daily aggregate
      const today = new Date();
      const dateKey = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      const existing = await app.prisma.pageAnalytics.findFirst({ where: { pageId: body.pageId, date: dateKey } });
      if (existing) {
        await app.prisma.pageAnalytics.update({ where: { id: existing.id }, data: { views: { increment: 1 } } });
      } else {
        await app.prisma.pageAnalytics.create({ data: { pageId: body.pageId, portalId: body.portalId, date: dateKey, views: 1, uniqueViews: 1 } });
      }
    }
    // Record generic user activity if authenticated
    try {
      await app.authenticate(req, reply);
      // @ts-ignore
      if (req.user?.sub) {
        await app.prisma.userActivity.create({
          data: {
            // @ts-ignore
            userId: req.user.sub,
            portalId: body.portalId,
            action: body.event,
            resourceType: body.pageId ? "page" : "event",
            resourceId: body.pageId,
            metadata: body.metadata || null,
          },
        });
      }
    } catch {
      // ignore if unauthenticated
    }
    reply.send({ ok: true });
  });

  // Dashboard metrics for admin
  app.get("/api/v1/admin/analytics/dashboard", async (req, reply) => {
    await app.authenticate(req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const { portalId } = (req.query as any) || {};
    if (!portalId) return reply.code(400).send({ error: { code: "PORTAL_ID_REQUIRED", message: "portalId is required" } });

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const aggr = await app.prisma.pageAnalytics.aggregate({
      where: { portalId, date: { gte: since } },
      _sum: { views: true, uniqueViews: true },
      _avg: { avgTimeOnPage: true, bounceRate: true },
    });
    reply.send({
      totalViews: aggr._sum.views || 0,
      totalUnique: aggr._sum.uniqueViews || 0,
      avgTimeOnPage: aggr._avg.avgTimeOnPage || 0,
      bounceRate: aggr._avg.bounceRate || 0,
      since,
    });
  });
}
