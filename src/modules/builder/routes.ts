import { FastifyPluginAsync } from 'fastify';

const builderRoutes: FastifyPluginAsync = async (fastify) => {
  // Get pages for portal
  fastify.get('/pages', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { portalId } = request.query as { portalId: string };

    // Verify user has access to this portal
    if (portalId !== request.user.portalId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    const pages = await fastify.prisma.pageBuilder.findMany({
      where: { portalId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return pages;
  });

  // Get single page
  fastify.get('/pages/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const page = await fastify.prisma.pageBuilder.findUnique({
      where: { id }
    });

    if (!page) {
      return reply.code(404).send({ error: 'Page not found' });
    }

    // Verify user has access to this portal
    if (page.portalId !== request.user.portalId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    return {
      'gjs-html': page.pageHtml || '',
      'gjs-css': page.pageCss || '',
      'gjs-components': page.pageData || {}
    };
  });

  // Save page
  fastify.put('/pages/:id', { preHandler: fastify.requireRole('editor') }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { 'gjs-html': pageHtml, 'gjs-css': pageCss, 'gjs-components': pageData } = request.body as any;

    // Get page to verify ownership
    const page = await fastify.prisma.pageBuilder.findUnique({
      where: { id }
    });

    if (!page) {
      return reply.code(404).send({ error: 'Page not found' });
    }

    // Verify user has access to this portal
    if (page.portalId !== request.user.portalId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    const updated = await fastify.prisma.pageBuilder.update({
      where: { id },
      data: {
        pageData,
        pageHtml,
        pageCss,
        updatedBy: request.user.sub,
        updatedAt: new Date()
      }
    });

    return updated;
  });

  // Create new page
  fastify.post('/pages', { preHandler: fastify.requireRole('editor') }, async (request, reply) => {
    const { portalId, name, slug } = request.body as any;

    // Verify user has access to this portal
    if (portalId !== request.user.portalId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    // Check if slug already exists in this portal
    const existing = await fastify.prisma.pageBuilder.findUnique({
      where: { portalId_slug: { portalId, slug } }
    });

    if (existing) {
      return reply.code(400).send({ error: 'A page with this slug already exists' });
    }

    const page = await fastify.prisma.pageBuilder.create({
      data: {
        portalId,
        name,
        slug,
        pageData: {},
        pageHtml: '',
        pageCss: '',
        createdBy: request.user.sub,
        updatedBy: request.user.sub,
      }
    });

    return page;
  });

  // Publish/unpublish page
  fastify.post('/pages/:id/publish', { preHandler: fastify.requireRole('editor') }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const page = await fastify.prisma.pageBuilder.findUnique({
      where: { id }
    });

    if (!page) {
      return reply.code(404).send({ error: 'Page not found' });
    }

    if (page.portalId !== request.user.portalId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    const updated = await fastify.prisma.pageBuilder.update({
      where: { id },
      data: {
        published: !page.published,
        updatedBy: request.user.sub,
      }
    });

    return { success: true, published: updated.published };
  });

  // Delete page
  fastify.delete('/pages/:id', { preHandler: fastify.requireRole('editor') }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const page = await fastify.prisma.pageBuilder.findUnique({
      where: { id }
    });

    if (!page) {
      return reply.code(404).send({ error: 'Page not found' });
    }

    if (page.portalId !== request.user.portalId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    await fastify.prisma.pageBuilder.delete({
      where: { id }
    });

    return { success: true };
  });

  // Public endpoint - Get published page by slug (NO AUTH REQUIRED)
  fastify.get('/pages/public/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const { portalId } = request.query as { portalId: string };

    const page = await fastify.prisma.pageBuilder.findFirst({
      where: {
        slug,
        portalId,
        published: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        pageHtml: true,
        pageCss: true,
        published: true,
      }
    });

    if (!page) {
      return reply.code(404).send({ error: 'Page not found' });
    }

    return page;
  });
};

export default builderRoutes;