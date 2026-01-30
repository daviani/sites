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

import { getAllArticles, getArticleBySlug, getAllTags, getFeaturedArticles } from '@/lib/content/blog';

// Helper to build valid frontmatter
function buildArticle(overrides: Record<string, string | boolean | string[]> = {}): string {
  const defaults: Record<string, string | boolean | string[]> = {
    slug: 'test-article',
    publishedAt: '2025-01-15',
    featured: false,
    titleFr: 'Article de test',
    titleEn: 'Test article',
    excerptFr: 'Résumé en français',
    excerptEn: 'English summary',
    tags: ['javascript', 'react'],
  };

  const data = { ...defaults, ...overrides };
  const lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === 'slug') continue; // slug comes from filename
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((v) => lines.push(`  - ${v}`));
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  return `---\n${lines.join('\n')}\n---\nArticle content here.`;
}

// POSTS_DIR matching the source code
const POSTS_DIR = path.join(process.cwd(), 'content/posts');

describe('content/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseFrontmatter — indirect via getAllArticles', () => {
    it('parses standard YAML key-value pairs', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue(buildArticle({ titleFr: 'Mon titre' }));

      const articles = getAllArticles();
      expect(articles[0].meta.titleFr).toBe('Mon titre');
    });

    it('parses boolean values (true/false)', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue(buildArticle({ featured: true }));

      const articles = getAllArticles();
      expect(articles[0].meta.featured).toBe(true);
    });

    it('parses array values (tags)', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue(buildArticle({ tags: ['ts', 'node'] }));

      const articles = getAllArticles();
      expect(articles[0].meta.tags).toEqual(['ts', 'node']);
    });

    it('parses quoted string values', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue(
        '---\npublishedAt: 2025-01-15\nfeatured: false\ntitleFr: "Mon Article"\ntitleEn: \'My Article\'\nexcerptFr: test\nexcerptEn: test\ntags:\n  - js\n---\nContent'
      );

      const articles = getAllArticles();
      expect(articles[0].meta.titleFr).toBe('Mon Article');
      expect(articles[0].meta.titleEn).toBe('My Article');
    });

    it('parses multiline values (>-)', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue(
        '---\npublishedAt: 2025-01-15\nfeatured: false\ntitleFr: Test\ntitleEn: Test\nexcerptFr: >-\n  line one\n  line two\nexcerptEn: summary\ntags:\n  - js\n---\nContent'
      );

      const articles = getAllArticles();
      expect(articles[0].meta.excerptFr).toBe('line one line two');
    });

    it('returns raw content when no frontmatter found', () => {
      mockExistsSync.mockImplementation((p: string) => {
        if (p === POSTS_DIR) return true;
        if (p.endsWith('.mdoc') && !p.includes('/')) return true;
        return false;
      });
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue('Just plain content without frontmatter');

      // Without frontmatter, Zod parsing will fail → article skipped
      const articles = getAllArticles();
      expect(articles).toHaveLength(0);
    });
  });

  describe('getAllArticles', () => {
    it('returns empty array when posts directory does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const articles = getAllArticles();
      expect(articles).toEqual([]);
    });

    it('returns articles sorted by publishedAt descending', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['old.mdoc', 'new.mdoc']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('old.mdoc')) {
          return buildArticle({ publishedAt: '2025-01-01' });
        }
        if (filePath.includes('new.mdoc')) {
          return buildArticle({ publishedAt: '2025-06-15' });
        }
        return '';
      });

      const articles = getAllArticles();
      expect(articles).toHaveLength(2);
      expect(articles[0].meta.publishedAt).toBe('2025-06-15');
      expect(articles[1].meta.publishedAt).toBe('2025-01-01');
    });

    it('filters only .mdoc files', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['article.mdoc', 'readme.txt', 'notes.md']);
      mockReadFileSync.mockReturnValue(buildArticle());

      const articles = getAllArticles();
      expect(articles).toHaveLength(1);
    });

    it('skips articles with invalid metadata', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['good.mdoc', 'broken.mdoc']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('good.mdoc')) {
          return buildArticle();
        }
        // Missing all required fields (publishedAt, titleFr, titleEn are required with no default)
        return '---\nfoo: bar\n---\nContent';
      });

      const articles = getAllArticles();
      expect(articles).toHaveLength(1);
      expect(articles[0].slug).toBe('good');
    });

    it('loads English content when available', () => {
      mockExistsSync.mockImplementation((p: string) => {
        if (p.includes('contentEn.mdoc')) return true;
        return true;
      });
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('contentEn.mdoc')) {
          return 'English content here';
        }
        return buildArticle();
      });

      const articles = getAllArticles();
      expect(articles[0].contentEn).toBe('English content here');
    });

    it('returns article without English content when not available', () => {
      mockExistsSync.mockImplementation((p: string) => {
        if (p.includes('contentEn.mdoc')) return false;
        return true;
      });
      mockReaddirSync.mockReturnValue(['test.mdoc']);
      mockReadFileSync.mockReturnValue(buildArticle());

      const articles = getAllArticles();
      expect(articles[0].contentEn).toBeUndefined();
    });
  });

  describe('getArticleBySlug', () => {
    it('returns article for existing slug', () => {
      mockExistsSync.mockImplementation((p: string) => {
        if (p.includes('contentEn.mdoc')) return false;
        return true;
      });
      mockReadFileSync.mockReturnValue(buildArticle());

      const article = getArticleBySlug('test-article');
      expect(article).not.toBeNull();
      expect(article!.slug).toBe('test-article');
    });

    it('returns null for non-existent slug', () => {
      mockExistsSync.mockReturnValue(false);

      const article = getArticleBySlug('non-existent');
      expect(article).toBeNull();
    });

    it('returns null for article with invalid metadata', () => {
      mockExistsSync.mockImplementation((p: string) => {
        if (p.includes('contentEn.mdoc')) return false;
        return true;
      });
      // Missing required fields
      mockReadFileSync.mockReturnValue('---\ntitleFr: Only a title\n---\nContent');

      const article = getArticleBySlug('invalid');
      expect(article).toBeNull();
    });

    it('includes English content when available', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('contentEn.mdoc')) {
          return 'English version';
        }
        return buildArticle();
      });

      const article = getArticleBySlug('test-article');
      expect(article!.contentEn).toBe('English version');
    });
  });

  describe('getAllTags', () => {
    it('returns unique sorted tags from all articles', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['a.mdoc', 'b.mdoc']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('a.mdoc')) {
          return buildArticle({ tags: ['react', 'javascript'], publishedAt: '2025-01-01' });
        }
        return buildArticle({ tags: ['javascript', 'node'], publishedAt: '2025-01-02' });
      });

      const tags = getAllTags();
      expect(tags).toEqual(['javascript', 'node', 'react']);
    });

    it('returns empty array when no articles exist', () => {
      mockExistsSync.mockReturnValue(false);

      const tags = getAllTags();
      expect(tags).toEqual([]);
    });
  });

  describe('getFeaturedArticles', () => {
    it('returns only articles with featured: true', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['featured.mdoc', 'normal.mdoc']);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('featured.mdoc')) {
          return buildArticle({ featured: true, publishedAt: '2025-01-01' });
        }
        return buildArticle({ featured: false, publishedAt: '2025-01-02' });
      });

      const articles = getFeaturedArticles();
      expect(articles).toHaveLength(1);
      expect(articles[0].meta.featured).toBe(true);
    });

    it('returns empty array when no featured articles', () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['a.mdoc']);
      mockReadFileSync.mockReturnValue(buildArticle({ featured: false }));

      const articles = getFeaturedArticles();
      expect(articles).toHaveLength(0);
    });
  });
});
