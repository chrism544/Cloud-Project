import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type JwtPayload = {
  sub: string; // user id
  role: string;
  portalId: string;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (role: string) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function authPlugin(app: FastifyInstance) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    app.log.warn("JWT_SECRET not set. Auth will reject requests.");
  }
  await app.register(jwt, {
    secret: secret || "development-secret",
    sign: {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    },
  });

  app.decorate("authenticate", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: { code: "UNAUTHORIZED", message: "Invalid or missing token" } });
    }
  });

  app.decorate("requireRole", (role: string) => {
    const ranks = ["viewer", "editor", "admin", "superadmin"];
    return async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await app.authenticate(req, reply);
        if (!req.user) return;
        const userRank = ranks.indexOf(req.user.role);
        const requiredRank = ranks.indexOf(role);
        if (userRank < requiredRank) {
          return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Insufficient role" } });
        }
      } catch {}
    };
  });
});