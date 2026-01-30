import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock articles data
const mockArticles = [
  {
    slug: 'test-article-1',
    meta: {
      titleFr: 'Premier Article',
      titleEn: 'First Article',
      excerptFr: 'Un extrait du premier article',
      excerptEn: 'An excerpt from the first article',
      publishedAt: '2024-01-15',
      tags: ['tech', 'javascript'],
    },
  },
  {
    slug: 'test-article-2',
    meta: {
      titleFr: 'Deuxième Article avec <caractères> & spéciaux',
      titleEn: 'Second Article with <characters> & special',
      excerptFr: 'Un extrait avec "guillemets" et l\'apostrophe',
      excerptEn: 'An excerpt with "quotes" and apostrophe\'s',
      publishedAt: '2024-02-20',
      tags: ['design', 'css'],
    },
  },
];

// Mock translations
const mockTranslations = {
  home: { title: 'Daviani' },
  pages: {
    blog: {
      title: 'Blog',
      subtitle: 'Articles techniques et réflexions',
    },
  },
};

// Mock fs module
vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(() => JSON.stringify(mockTranslations)),
  },
}));

// Mock blog content
vi.mock('@/lib/content/blog', () => ({
  getAllArticles: vi.fn(() => mockArticles),
}));

describe('RSS API Route', () => {
  let GET: () => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    // Set environment variables
    vi.stubEnv('NEXT_PUBLIC_PROTOCOL', 'https');
    vi.stubEnv('NEXT_PUBLIC_DOMAIN', 'daviani.dev');

    const routeModule = await import('@/app/api/rss/route');
    GET = routeModule.GET;
  });

  describe('GET /api/rss', () => {
    it('returns RSS XML with correct content type', async () => {
      const response = await GET();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');
    });

    it('returns RSS XML with cache headers', async () => {
      const response = await GET();

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
    });

    it('generates valid RSS XML structure', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(xml).toContain('<channel>');
      expect(xml).toContain('</channel>');
      expect(xml).toContain('</rss>');
    });

    it('includes channel metadata', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('<title>Daviani - Blog</title>');
      expect(xml).toContain('<link>https://blog.daviani.dev</link>');
      expect(xml).toContain('<description>Articles techniques et réflexions</description>');
      expect(xml).toContain('<language>fr</language>');
    });

    it('includes atom:link for RSS self-reference', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('atom:link href="https://daviani.dev/api/rss"');
      expect(xml).toContain('rel="self"');
      expect(xml).toContain('type="application/rss+xml"');
    });

    it('includes channel image', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('<image>');
      expect(xml).toContain('<url>https://daviani.dev/owl-logo.png</url>');
      expect(xml).toContain('</image>');
    });

    it('includes articles as items', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('<item>');
      expect(xml).toContain('Premier Article');
      expect(xml).toContain('<link>https://blog.daviani.dev/test-article-1</link>');
      expect(xml).toContain('<guid isPermaLink="true">https://blog.daviani.dev/test-article-1</guid>');
    });

    it('escapes special XML characters in titles', async () => {
      const response = await GET();
      const xml = await response.text();

      // Check that < > & are escaped
      expect(xml).toContain('&lt;caractères&gt;');
      expect(xml).toContain('&amp;');
      expect(xml).not.toContain('<caractères>');
    });

    it('escapes special XML characters in descriptions', async () => {
      const response = await GET();
      const xml = await response.text();

      // Check that quotes and apostrophes are escaped
      expect(xml).toContain('&quot;guillemets&quot;');
      expect(xml).toContain('l&apos;apostrophe');
    });

    it('includes article tags as categories', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('<category>tech</category>');
      expect(xml).toContain('<category>javascript</category>');
      expect(xml).toContain('<category>design</category>');
      expect(xml).toContain('<category>css</category>');
    });

    it('includes pubDate for each item', async () => {
      const response = await GET();
      const xml = await response.text();

      // Check for RFC 2822 date format
      expect(xml).toMatch(/<pubDate>.*2024.*<\/pubDate>/);
    });

    it('includes lastBuildDate in channel', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('<lastBuildDate>');
      expect(xml).toContain('</lastBuildDate>');
    });
  });

  describe('XML escaping', () => {
    it('escapes ampersand correctly', async () => {
      const response = await GET();
      const xml = await response.text();

      // Ensure & is escaped but not double-escaped
      expect(xml).toContain('&amp;');
      expect(xml).not.toContain('&amp;amp;');
    });

    it('escapes less-than correctly', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('&lt;');
    });

    it('escapes greater-than correctly', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('&gt;');
    });

    it('escapes quotes correctly', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('&quot;');
    });

    it('escapes apostrophes correctly', async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain('&apos;');
    });
  });

  describe('empty articles', () => {
    it('returns valid RSS with no items when no articles exist', async () => {
      const { getAllArticles } = await import('@/lib/content/blog');
      vi.mocked(getAllArticles).mockReturnValueOnce([]);

      const response = await GET();
      const xml = await response.text();

      expect(response.status).toBe(200);
      expect(xml).toContain('<channel>');
      expect(xml).toContain('</channel>');
      // Should not contain any items
      expect(xml).not.toContain('<item>');
    });
  });
});
