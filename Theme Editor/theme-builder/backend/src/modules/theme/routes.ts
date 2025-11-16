import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AppError } from '@/utils/errors';
import { 
  createTheme, 
  getThemes, 
  getThemeById, 
  updateTheme, 
  deleteTheme 
} from './services';

const themeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  properties: z.object({
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
    }).optional(),
    fonts: z.object({
      heading: z.string().optional(),
      body: z.string().optional(),
    }).optional(),
  }).optional(),
});

export default async (app: FastifyInstance) => {
  app.get('/themes', { preHandler: app.authenticate }, async (req, reply) => {
    try {
      const themes = await getThemes(req.user.portalId);
      reply.send(themes);
    } catch (error) {
      throw new AppError('Failed to fetch themes', 'THEME_FETCH_ERROR');
    }
  });

  app.get('/themes/:id', { preHandler: app.authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const theme = await getThemeById(id, req.user.portalId);
      if (!theme) {
        throw new AppError('Theme not found', 'THEME_NOT_FOUND');
      }
      reply.send(theme);
    } catch (error) {
      throw new AppError('Failed to fetch theme', 'THEME_FETCH_ERROR');
    }
  });

  app.post('/themes', { preHandler: app.authenticate }, async (req, reply) => {
    const parsed = themeSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid theme data', 'THEME_VALIDATION_ERROR');
    }
    try {
      const newTheme = await createTheme(parsed.data, req.user.portalId);
      reply.status(201).send(newTheme);
    } catch (error) {
      throw new AppError('Failed to create theme', 'THEME_CREATE_ERROR');
    }
  });

  app.put('/themes/:id', { preHandler: app.authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = themeSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid theme data', 'THEME_VALIDATION_ERROR');
    }
    try {
      const updatedTheme = await updateTheme(id, parsed.data, req.user.portalId);
      reply.send(updatedTheme);
    } catch (error) {
      throw new AppError('Failed to update theme', 'THEME_UPDATE_ERROR');
    }
  });

  app.delete('/themes/:id', { preHandler: app.authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      await deleteTheme(id, req.user.portalId);
      reply.status(204).send();
    } catch (error) {
      throw new AppError('Failed to delete theme', 'THEME_DELETE_ERROR');
    }
  });
};