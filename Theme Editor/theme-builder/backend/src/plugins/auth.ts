import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import jwt from '@fastify/jwt';

export default async function authPlugin(app: FastifyInstance, options: FastifyPluginOptions) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret', // Use a strong secret in production
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.decorate('requireRole', (role: string) => {
    return async (request, reply) => {
      await request.jwtVerify();
      const user = request.user;

      if (user.role !== role) {
        return reply.status(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
      }
    };
  });
}