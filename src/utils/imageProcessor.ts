import sharp from 'sharp';
import path from 'path';
import { Readable } from 'stream';

export interface ImageSize {
  width: number;
  height?: number;
  suffix: string;
}

export interface ProcessedImage {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
}

export const IMAGE_SIZES: Record<string, ImageSize> = {
  thumbnail: { width: 150, height: 150, suffix: '-thumb' },
  small: { width: 300, suffix: '-sm' },
  medium: { width: 768, suffix: '-md' },
  large: { width: 1920, suffix: '-lg' },
};

/**
 * Process and optimize an image with multiple size variants
 */
export async function processImage(
  fileBuffer: Buffer,
  originalFilename: string,
  options: {
    generateSizes?: boolean;
    convertToWebP?: boolean;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<ProcessedImage[]> {
  const {
    generateSizes = true,
    convertToWebP = true,
    quality = 85,
    maxWidth = 2560,
    maxHeight = 2560,
  } = options;

  const results: ProcessedImage[] = [];
  const ext = path.extname(originalFilename);
  const basename = path.basename(originalFilename, ext);

  // Load image metadata
  const metadata = await sharp(fileBuffer).metadata();

  // Original optimized version
  const originalOptimized = await sharp(fileBuffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  results.push({
    buffer: originalOptimized,
    filename: `${basename}${ext}`,
    mimeType: 'image/jpeg',
    size: originalOptimized.length,
  });

  // WebP version
  if (convertToWebP) {
    const webpBuffer = await sharp(fileBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    results.push({
      buffer: webpBuffer,
      filename: `${basename}.webp`,
      mimeType: 'image/webp',
      size: webpBuffer.length,
    });
  }

  // Generate multiple sizes
  if (generateSizes) {
    for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      // Skip if original image is smaller than target size
      if (metadata.width && metadata.width < sizeConfig.width) {
        continue;
      }

      const resizedBuffer = await sharp(fileBuffer)
        .resize(sizeConfig.width, sizeConfig.height, {
          fit: sizeConfig.height ? 'cover' : 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      results.push({
        buffer: resizedBuffer,
        filename: `${basename}${sizeConfig.suffix}${ext}`,
        mimeType: 'image/jpeg',
        size: resizedBuffer.length,
      });

      // WebP variant for each size
      if (convertToWebP) {
        const webpBuffer = await sharp(fileBuffer)
          .resize(sizeConfig.width, sizeConfig.height, {
            fit: sizeConfig.height ? 'cover' : 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality })
          .toBuffer();

        results.push({
          buffer: webpBuffer,
          filename: `${basename}${sizeConfig.suffix}.webp`,
          mimeType: 'image/webp',
          size: webpBuffer.length,
        });
      }
    }
  }

  return results;
}

/**
 * Convert stream to buffer
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Validate if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/') && !mimeType.includes('svg');
}

/**
 * Extract dominant colors from image
 */
export async function extractColors(fileBuffer: Buffer): Promise<string[]> {
  const { dominant } = await sharp(fileBuffer).stats();

  return [
    `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`,
  ];
}

/**
 * Generate image metadata
 */
export async function getImageMetadata(fileBuffer: Buffer) {
  const metadata = await sharp(fileBuffer).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation,
  };
}
