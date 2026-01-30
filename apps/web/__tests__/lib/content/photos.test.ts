import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'node:path';

const mockExistsSync = vi.fn();
const mockReaddirSync = vi.fn();
const mockReadFileSync = vi.fn();

vi.mock('node:fs', () => ({
  default: {
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readdirSync: (...args: unknown[]) => mockReaddirSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  },
}));

vi.mock('yaml', () => ({
  default: {
    parse: (content: string) => {
      // Simple YAML-like parser for tests
      const result: Record<string, unknown> = {};
      const lines = content.split('\n');
      let currentArray: string[] | null = null;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') && currentArray) {
          currentArray.push(trimmed.slice(2));
        } else if (trimmed.includes(':')) {
          const colonIdx = trimmed.indexOf(':');
          const key = trimmed.slice(0, colonIdx).trim();
          const rawValue = trimmed.slice(colonIdx + 1).trim();

          if (rawValue === '') {
            currentArray = [];
            result[key] = currentArray;
          } else {
            currentArray = null;
            // Parse numbers
            if (/^\d+$/.test(rawValue)) {
              result[key] = parseInt(rawValue, 10);
            } else {
              result[key] = rawValue;
            }
          }
        }
      }
      return result;
    },
  },
}));

import { getAllPhotos, getPhotoBySlug } from '@/lib/content/photos';

function buildYaml(overrides: Record<string, unknown> = {}): string {
  const defaults = {
    title: 'Sunset',
    width: 1920,
    height: 1080,
    altFr: 'Coucher de soleil',
    altEn: 'Sunset view',
    tags: ['nature', 'landscape'],
  };
  const data = { ...defaults, ...overrides };
  const lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((v) => lines.push(`  - ${v}`));
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  return lines.join('\n');
}

describe('content/photos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPhotos', () => {
    it('returns empty array when directory does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      const photos = getAllPhotos('/fake/dir');
      expect(photos).toEqual([]);
    });

    it('returns photos from YAML files', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['sunset.yaml', 'mountain.yaml']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('sunset.yaml')) {
          return buildYaml({ title: 'Sunset' });
        }
        return buildYaml({ title: 'Mountain' });
      });

      const photos = getAllPhotos('/test/dir');
      expect(photos).toHaveLength(2);
    });

    it('filters only .yaml files', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['photo.yaml', 'readme.md', 'image.png']);
      mockReadFileSync.mockReturnValue(buildYaml());

      const photos = getAllPhotos('/test/dir');
      expect(photos).toHaveLength(1);
    });

    it('uses slug from filename', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['my-photo.yaml']);
      mockReadFileSync.mockReturnValue(buildYaml());

      const photos = getAllPhotos('/test/dir');
      expect(photos[0].id).toBe('my-photo');
    });

    it('builds correct src path', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['sunset.yaml']);
      mockReadFileSync.mockReturnValue(buildYaml());

      const photos = getAllPhotos('/test/dir');
      expect(photos[0].src).toBe('/photos/sunset.webp');
    });

    it('uses altFr as primary alt text', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.yaml']);
      mockReadFileSync.mockReturnValue(buildYaml({ altFr: 'Mon alt FR' }));

      const photos = getAllPhotos('/test/dir');
      expect(photos[0].alt).toBe('Mon alt FR');
    });

    it('falls back to altEn when altFr missing', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.yaml']);
      mockReadFileSync.mockReturnValue(buildYaml({ altFr: undefined, altEn: 'English alt' }));

      const photos = getAllPhotos('/test/dir');
      // altFr is undefined, so it falls back
      expect(photos[0].alt).toContain('English alt');
    });

    it('maps dimensions correctly', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.yaml']);
      mockReadFileSync.mockReturnValue(buildYaml({ width: 3840, height: 2160 }));

      const photos = getAllPhotos('/test/dir');
      expect(photos[0].width).toBe(3840);
      expect(photos[0].height).toBe(2160);
    });

    it('normalizes tags to lowercase and trims', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.yaml']);
      mockReadFileSync.mockReturnValue(buildYaml({ tags: ['Nature', ' Landscape '] }));

      const photos = getAllPhotos('/test/dir');
      expect(photos[0].tags).toEqual(['nature', 'landscape']);
    });

    it('skips photos with invalid metadata', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['good.yaml', 'bad.yaml']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('good.yaml')) {
          return buildYaml();
        }
        // Missing required width/height
        return 'title: Bad photo';
      });

      const photos = getAllPhotos('/test/dir');
      expect(photos).toHaveLength(1);
      expect(photos[0].id).toBe('good');
    });

    it('uses title as fallback for alt text', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.yaml']);
      // No altFr or altEn, just title
      mockReadFileSync.mockReturnValue(
        'title: Mountain Peak\nwidth: 1920\nheight: 1080\ntags:\n  - nature'
      );

      const photos = getAllPhotos('/test/dir');
      expect(photos[0].alt).toBe('Mountain Peak');
    });
  });

  describe('getPhotoBySlug', () => {
    it('returns photo for existing slug', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(buildYaml({ title: 'Found' }));

      const photo = getPhotoBySlug('sunset', '/test/dir');
      expect(photo).not.toBeNull();
      expect(photo!.id).toBe('sunset');
      expect(photo!.title).toBe('Found');
    });

    it('returns null when yaml file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const photo = getPhotoBySlug('nonexistent', '/test/dir');
      expect(photo).toBeNull();
    });

    it('returns null for invalid yaml content', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Parse error');
      });

      const photo = getPhotoBySlug('broken', '/test/dir');
      expect(photo).toBeNull();
    });

    it('builds correct file path from slug', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(buildYaml());

      getPhotoBySlug('my-photo', '/test/dir');
      expect(mockExistsSync).toHaveBeenCalledWith(path.join('/test/dir', 'my-photo.yaml'));
    });
  });
});