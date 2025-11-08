import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";

const registerSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(8),
  portalId: z.string().uuid(),
  role: z.enum(["viewer", "editor", "admin"]).optional(),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const forgotSchema = z.object({ email: z.string().min(1) });

const resetSchema = z.object({ token: z.string().min(1), newPassword: z.string().min(8) });

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export default async function authRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/auth";

  app.post(`${prefix}/register`, async (req, reply) => {
    const { email, password, portalId, role } = registerSchema.parse(req.body);
    const existing = await app.prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(400).send({ error: { code: "USER_EXISTS", message: "User already exists" } });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await app.prisma.user.create({ data: { email, passwordHash, portalId, role: role || "viewer" } });
    reply.code(201).send({ id: user.id, email: user.email });
  });

  app.post(`${prefix}/login`, async (req, reply) => {
    const { emailOrUsername, password } = loginSchema.parse(req.body);
    const user = await app.prisma.user.findFirst({ where: { email: emailOrUsername } });
    if (!user) return reply.code(401).send({ error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } });

    const accessToken = app.jwt.sign({ sub: user.id, role: user.role, portalId: user.portalId });
    const rawRefresh = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawRefresh);
    const expiresAt = new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRY || "7d"));
    await app.prisma.refreshToken.create({ data: { tokenHash, userId: user.id, expiresAt } });
    reply.send({ accessToken, refreshToken: rawRefresh });
  });

  app.post(`${prefix}/refresh`, async (req, reply) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokenHash = hashToken(refreshToken);
    const token = await app.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!token || token.isRevoked || token.expiresAt < new Date()) {
      return reply.code(401).send({ error: { code: "INVALID_REFRESH", message: "Invalid refresh token" } });
    }
    const user = await app.prisma.user.findUnique({ where: { id: token.userId } });
    if (!user) return reply.code(401).send({ error: { code: "INVALID_REFRESH", message: "Invalid refresh token" } });
    // rotate
    await app.prisma.refreshToken.delete({ where: { tokenHash } });
    const newRaw = crypto.randomBytes(32).toString("hex");
    const newHash = hashToken(newRaw);
    const expiresAt = new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRY || "7d"));
    await app.prisma.refreshToken.create({ data: { tokenHash: newHash, userId: user.id, expiresAt } });
    const accessToken = app.jwt.sign({ sub: user.id, role: user.role, portalId: user.portalId });
    reply.send({ accessToken, refreshToken: newRaw });
  });

  app.post(`${prefix}/logout`, { preHandler: app.authenticate }, async (req, reply) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokenHash = hashToken(refreshToken);
    await app.prisma.refreshToken.deleteMany({ where: { tokenHash } });
    reply.code(204).send();
  });

  app.post(`${prefix}/forgot-password`, async (req, reply) => {
    const { email } = forgotSchema.parse(req.body);
    const user = await app.prisma.user.findFirst({ where: { email } });
    if (!user) return reply.code(200).send({ ok: true }); // avoid user enumeration
    const raw = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30m
    await app.prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt } });
    // TODO: send email via notifications service (Phase 13)
    reply.send({ ok: true, resetToken: process.env.NODE_ENV === "development" ? raw : undefined });
  });

  app.post(`${prefix}/reset-password`, async (req, reply) => {
    const { token, newPassword } = resetSchema.parse(req.body);
    const tokenHash = hashToken(token);
    const rec = await app.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!rec || rec.expiresAt < new Date()) return reply.code(400).send({ error: { code: "INVALID_TOKEN", message: "Invalid token" } });
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await app.prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } });
    await app.prisma.passwordResetToken.delete({ where: { tokenHash } });
    reply.send({ ok: true });
  });
}

// Simple ms parser for durations like '7d', '15m'
function ms(str: string): number {
  const m = /^([0-9]+)([smhd])$/.exec(str);
  if (!m) return Number(str);
  const n = Number(m[1]);
  const unit = m[2];
  return unit === "s" ? n * 1000 : unit === "m" ? n * 60_000 : unit === "h" ? n * 3_600_000 : n * 86_400_000;
}
