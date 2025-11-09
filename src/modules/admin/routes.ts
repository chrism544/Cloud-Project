import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

// Helper: require admin for a given portal
async function requireAdmin(app: FastifyInstance, req: FastifyRequest, reply: FastifyReply) {
  await app.authenticate(req, reply);
  // If authenticate already failed, stop
  // @ts-ignore
  if (!req.user) return;

  // Superadmin shortcut
  // @ts-ignore
  if (req.user.role === "superadmin") return;

  const portalIdHeader = (req.headers["x-portal-id"] as string) || undefined;
  // @ts-ignore
  const portalIdToken = req.user.portalId as string | undefined;
  const portalId = portalIdHeader || portalIdToken;

  if (!portalId) {
    return reply.code(400).send({ error: { code: "PORTAL_ID_REQUIRED", message: "X-Portal-ID header or token portalId is required" } });
  }
  // @ts-ignore
  const userId = req.user.sub as string;

  // Allow legacy JWT admin role
  // @ts-ignore
  if (req.user.role === "admin") return;

  // Check UserOnPortal role
  const link = await app.prisma.userOnPortal.findUnique({
    where: { userId_portalId: { userId, portalId } },
  });

  if (!link || (link.assignedRole !== "PORTAL_ADMIN" && link.assignedRole !== "SUPER_ADMIN")) {
    return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Admin access required" } });
  }
}

export default async function adminRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/admin";

  // ================
  // Theme Management
  // ================
  const themeCreateSchema = z.object({
    name: z.string().min(1),
    portalId: z.string().uuid(),
    tokens: z.any(),
    isActive: z.boolean().optional(),
  });
  const themeUpdateSchema = z.object({ name: z.string().min(1).optional(), tokens: z.any().optional(), isActive: z.boolean().optional() });

  app.get(`${prefix}/themes`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return; // early exit if unauthorized already sent
    const { portalId } = (req.query as any) || {};
    const where = portalId ? { portalId } : {};
    const items = await app.prisma.theme.findMany({ where, orderBy: { createdAt: "desc" } });
    reply.send(items);
  });

  app.post(`${prefix}/themes`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const body = themeCreateSchema.parse(req.body);
    // If creating an active theme, deactivate others in same portal
    if (body.isActive) {
      await app.prisma.theme.updateMany({ where: { portalId: body.portalId, isActive: true }, data: { isActive: false } });
    }
    const created = await app.prisma.theme.create({ data: { name: body.name, portalId: body.portalId, tokens: body.tokens, isActive: !!body.isActive } });
    reply.code(201).send(created);
  });

  app.put(`${prefix}/themes/:id`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const { id } = req.params as { id: string };
    const data = themeUpdateSchema.parse(req.body);

    const existing = await app.prisma.theme.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Theme not found" } });

    if (data.isActive) {
      await app.prisma.theme.updateMany({ where: { portalId: existing.portalId, isActive: true }, data: { isActive: false } });
    }

    const updated = await app.prisma.theme.update({ where: { id }, data });
    reply.send(updated);
  });

  app.post(`${prefix}/themes/:id/activate`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const { id } = req.params as { id: string };
    const theme = await app.prisma.theme.findUnique({ where: { id } });
    if (!theme) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Theme not found" } });
    await app.prisma.theme.updateMany({ where: { portalId: theme.portalId, isActive: true }, data: { isActive: false } });
    const updated = await app.prisma.theme.update({ where: { id }, data: { isActive: true } });
    reply.send(updated);
  });

  // Active tokens for current portal (consumed by editors/UI)
  app.get(`${prefix}/themes/active/tokens`, async (req, reply) => {
    await app.authenticate(req, reply); // only authenticated users
    // @ts-ignore
    if (reply.sent) return;
    const { portalId } = (req.query as any) || {};
    if (!portalId) return reply.code(400).send({ error: { code: "PORTAL_ID_REQUIRED", message: "portalId is required" } });
    const active = await app.prisma.theme.findFirst({ where: { portalId, isActive: true } });
    reply.send(active?.tokens || {});
  });

  // ================
  // Users (basic list)
  // ================
  app.get(`${prefix}/users`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const qp = (req.query as any) || {};
    const page = Math.max(1, parseInt(qp.page || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(qp.pageSize || "20", 10)));
    const portalId = qp.portalId as string | undefined;

    const where = portalId ? { portalId } : {};
    const [items, total] = await Promise.all([
      app.prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      app.prisma.user.count({ where }),
    ]);

    reply.send({ items, page, pageSize, total });
  });

  // ================
  // Audit Logs (basic)
  // ================
  app.get(`${prefix}/audit-logs`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const qp = (req.query as any) || {};
    const portalId = qp.portalId as string | undefined;
    const where = portalId ? { portalId } : {};
    const logs = await app.prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
    reply.send(logs);
  });

  // ================
  // Security Alerts
  // ================
  app.get(`${prefix}/security-alerts`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const { portalId } = (req.query as any) || {};
    if (!portalId) return reply.code(400).send({ error: { code: "PORTAL_ID_REQUIRED", message: "portalId is required" } });
    const alerts = await app.prisma.securityAlert.findMany({ where: { portalId }, orderBy: { createdAt: "desc" }, take: 200 });
    reply.send(alerts);
  });

  app.put(`${prefix}/security-alerts/:id/resolve`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const { id } = req.params as { id: string };
    // @ts-ignore
    const userId = req.user.sub as string;
    const updated = await app.prisma.securityAlert.update({ where: { id }, data: { resolved: true, resolvedBy: userId, resolvedAt: new Date() } });
    reply.send(updated);
  });

  // ================
  // Permissions Audit
  // ================
  app.get(`${prefix}/permissions/audit`, async (req, reply) => {
    await requireAdmin(app, req, reply);
    // @ts-ignore
    if (reply.sent) return;
    const { portalId } = (req.query as any) || {};
    if (!portalId) return reply.code(400).send({ error: { code: "PORTAL_ID_REQUIRED", message: "portalId is required" } });
    const links = await app.prisma.userOnPortal.findMany({ where: { portalId }, include: { user: true }, take: 500 });
    reply.send(links.map(l => ({ userId: l.userId, email: l.user?.email, role: l.assignedRole, isActive: l.isActive })));
  });
}
