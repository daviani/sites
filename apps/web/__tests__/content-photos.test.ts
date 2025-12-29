import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { getAllPhotos, getPhotoBySlug, type Photo } from '@/lib/content/photos';

describe('Photos Content Loader', () => {
  const testDir = path.join(__dirname, '__fixtures__/photos-content-test');

  beforeEach(() => {
    // Create test directory with sample photos
    // Keystatic structure: {slug}.yaml + {slug}/image.heic
    fs.mkdirSync(testDir, { recursive: true });

    // Create sample photo entries
    fs.writeFileSync(
      path.join(testDir, 'sunset-mountain.yaml'),
      yaml.stringify({
        title: 'Sunset Mountain',
        width: 4032,
        height: 3024,
        altFr: 'Coucher de soleil sur la montagne',
        altEn: 'Sunset over the mountain',
        tags: ['nature'],
      })
    );

    fs.writeFileSync(
      path.join(testDir, 'ocean-waves.yaml'),
      yaml.stringify({
        title: 'Ocean Waves',
        width: 3840,
        height: 2160,
        tags: [],
      })
    );
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('getAllPhotos', () => {
    it('returns an array', () => {
      const photos = getAllPhotos(testDir);
      expect(Array.isArray(photos)).toBe(true);
    });

    it('returns empty array when directory does not exist', () => {
      const photos = getAllPhotos('/non/existent/path');
      expect(photos).toEqual([]);
    });

    it('returns photos with correct structure', () => {
      const photos = getAllPhotos(testDir);
      expect(photos.length).toBeGreaterThan(0);

      photos.forEach((photo: Photo) => {
        expect(photo).toHaveProperty('id');
        expect(photo).toHaveProperty('title');
        expect(photo).toHaveProperty('src');
        expect(photo).toHaveProperty('alt');
        expect(photo).toHaveProperty('width');
        expect(photo).toHaveProperty('height');
        expect(photo).toHaveProperty('tags');
      });
    });

    it('generates correct src path', () => {
      const photos = getAllPhotos(testDir);
      const photo = photos.find((p: Photo) => p.id === 'sunset-mountain');
      expect(photo?.src).toBe('/photos/sunset-mountain.webp');
    });

    it('uses filename as id', () => {
      const photos = getAllPhotos(testDir);
      const photo = photos.find((p: Photo) => p.id === 'sunset-mountain');
      expect(photo).toBeDefined();
      expect(photo?.title).toBe('Sunset Mountain');
    });
  });

  describe('getPhotoBySlug', () => {
    it('returns null for non-existent slug', () => {
      const photo = getPhotoBySlug('non-existent-photo', testDir);
      expect(photo).toBeNull();
    });

    it('returns photo with correct id', () => {
      const photo = getPhotoBySlug('sunset-mountain', testDir);
      expect(photo).not.toBeNull();
      expect(photo?.id).toBe('sunset-mountain');
    });

    it('returns photo with correct dimensions', () => {
      const photo = getPhotoBySlug('sunset-mountain', testDir);
      expect(photo?.width).toBe(4032);
      expect(photo?.height).toBe(3024);
    });
  });

  describe('Photo type', () => {
    it('each photo has numeric width and height', () => {
      const photos = getAllPhotos(testDir);
      photos.forEach((photo: Photo) => {
        expect(typeof photo.width).toBe('number');
        expect(typeof photo.height).toBe('number');
        expect(photo.width).toBeGreaterThan(0);
        expect(photo.height).toBeGreaterThan(0);
      });
    });

    it('each photo has default empty tags array', () => {
      const photos = getAllPhotos(testDir);
      photos.forEach((photo: Photo) => {
        expect(Array.isArray(photo.tags)).toBe(true);
      });
    });
  });
});
