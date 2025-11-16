import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/errors';

// Create a new theme
export const createTheme = async (data) => {
  try {
    const theme = await prisma.theme.create({
      data,
    });
    return theme;
  } catch (error) {
    throw new AppError('Failed to create theme', 'THEME_CREATION_ERROR');
  }
};

// Fetch all themes for a portal
export const getThemes = async (portalId) => {
  try {
    const themes = await prisma.theme.findMany({
      where: { portalId },
    });
    return themes;
  } catch (error) {
    throw new AppError('Failed to fetch themes', 'THEME_FETCH_ERROR');
  }
};

// Update an existing theme
export const updateTheme = async (id, data) => {
  try {
    const theme = await prisma.theme.update({
      where: { id },
      data,
    });
    return theme;
  } catch (error) {
    throw new AppError('Failed to update theme', 'THEME_UPDATE_ERROR');
  }
};

// Delete a theme
export const deleteTheme = async (id) => {
  try {
    await prisma.theme.delete({
      where: { id },
    });
  } catch (error) {
    throw new AppError('Failed to delete theme', 'THEME_DELETION_ERROR');
  }
};