import { z } from 'zod';

export const ThemeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Theme name is required'),
  colors: z.object({
    primary: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color'),
    secondary: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color'),
    background: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color'),
  }),
  fonts: z.object({
    header: z.string().min(1, 'Header font is required'),
    body: z.string().min(1, 'Body font is required'),
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;