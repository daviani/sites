import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { z } from 'zod';

/**
 * Schema for photo metadata validation
 */
const photoSchema = z.object({
  title: z.string().optional(),
  image: z.string().optional(),
  width: z.number(),
  height: z.number(),
  tags: z.array(z.string()).default([]),
  altFr: z.string().optional(),
  altEn: z.string().optional(),
});

export type PhotoMeta = z.infer<typeof photoSchema>;

export interface Photo {
  id: string;
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
}

/**
 * Default photos directory
 * - Development: content/photos/local (test photos)
 * - Production: content/photos (real photos from GitHub)
 */
const isProd = process.env.NODE_ENV === 'production';
const DEFAULT_PHOTOS_DIR = path.join(process.cwd(), isProd ? 'content/photos' : 'content/photos/local');

/**
 * Get all photos from the content directory
 * Keystatic structure: {slug}.yaml + {slug}/image.heic
 */
export function getAllPhotos(photosDir: string = DEFAULT_PHOTOS_DIR): Photo[] {
  if (!fs.existsSync(photosDir)) {
    return [];
  }

  const photos: Photo[] = [];
  const entries = fs.readdirSync(photosDir);

  // Find all YAML files (Keystatic creates {slug}.yaml files)
  const yamlFiles = entries.filter((f) => f.endsWith('.yaml'));

  for (const yamlFile of yamlFiles) {
    const slug = path.basename(yamlFile, '.yaml');
    const yamlPath = path.join(photosDir, yamlFile);

    try {
      const yamlContent = yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
      const meta = photoSchema.parse(yamlContent);

      photos.push({
        id: slug,
        title: meta.title || slug,
        src: `/photos/${slug}.webp`,
        alt: meta.altFr || meta.altEn || meta.title || slug,
        width: meta.width,
        height: meta.height,
        tags: meta.tags.map((t) => t.toLowerCase().trim()).filter((t) => t.length > 0),
      });
    } catch {
      // Skip invalid photos (e.g., missing width/height before processing)
    }
  }

  return photos;
}

/**
 * Get a single photo by slug
 * Keystatic structure: {slug}.yaml
 */
export function getPhotoBySlug(
  slug: string,
  photosDir: string = DEFAULT_PHOTOS_DIR
): Photo | null {
  const yamlPath = path.join(photosDir, `${slug}.yaml`);

  if (!fs.existsSync(yamlPath)) {
    return null;
  }

  try {
    const yamlContent = yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
    const meta = photoSchema.parse(yamlContent);

    return {
      id: slug,
      title: meta.title || slug,
      src: `/photos/${slug}.webp`,
      alt: meta.altFr || meta.altEn || meta.title || slug,
      width: meta.width,
      height: meta.height,
      tags: meta.tags.map((t) => t.toLowerCase().trim()).filter((t) => t.length > 0),
    };
  } catch {
    return null;
  }
}
