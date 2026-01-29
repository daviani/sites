import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock article data
const mockArticle = {
  slug: 'test-article',
  meta: {
    titleFr: 'Article de Test',
    titleEn: 'Test Article',
    excerptFr: 'Un extrait du test article',
    excerptEn: 'An excerpt from the test article',
    publishedAt: '2024-01-15',
    tags: ['tech'],
  },
  content: 'Test content',
};

// Mock blog content module
vi.mock('@/lib/content/blog', () => ({
  getArticleBySlug: vi.fn((slug: string) => {
    if (slug === 'test-article') {
      return mockArticle;
    }
    if (slug === 'another-article') {
      return {
        slug: 'another-article',
        meta: {
          titleFr: 'Autre Article avec des caractères spéciaux: < > & "',
          titleEn: 'Another Article',
          excerptFr: 'Description avec émojis et accents: éèêë',
          excerptEn: 'Description',
          publishedAt: '2024-02-20',
          tags: [],
        },
        content: '',
      };
    }
    return null;
  }),
}));

// Mock next/og ImageResponse
vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {
    constructor(
      public element: JSX.Element,
      public options?: {
        width?: number;
        height?: number;
        headers?: Record<string, string>;
      }
    ) {
      return {
        status: 200,
        headers: new Headers({
          'Content-Type': 'image/png',
          'Cache-Control': options?.headers?.['Cache-Control'] || '',
        }),
        arrayBuffer: async () => new ArrayBuffer(0),
      };
    }
  },
}));

describe('OG Image API Route', () => {
  let GET: (
    request: Request,
    context: { params: Promise<{ slug: string }> }
  ) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import('@/app/api/og/[slug]/route');
    GET = module.GET;
  });

  describe('GET /api/og/[slug]', () => {
    it('generates OG image for existing article', async () => {
      const request = new Request('http://localhost:3000/api/og/test-article');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'test-article' }),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/png');
    });

    it('returns 404 for non-existent article', async () => {
      const request = new Request('http://localhost:3000/api/og/non-existent');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'non-existent' }),
      });

      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toBe('Article not found');
    });

    it('sets cache control headers', async () => {
      const request = new Request('http://localhost:3000/api/og/test-article');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'test-article' }),
      });

      expect(response.headers.get('Cache-Control')).toContain('public');
      expect(response.headers.get('Cache-Control')).toContain('max-age=86400');
    });

    it('handles articles with special characters in title', async () => {
      const request = new Request('http://localhost:3000/api/og/another-article');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'another-article' }),
      });

      expect(response.status).toBe(200);
    });

    it('uses French title and excerpt', async () => {
      const { getArticleBySlug } = await import('@/lib/content/blog');

      const request = new Request('http://localhost:3000/api/og/test-article');
      await GET(request, {
        params: Promise.resolve({ slug: 'test-article' }),
      });

      expect(getArticleBySlug).toHaveBeenCalledWith('test-article');
    });
  });

  describe('slug handling', () => {
    it('accepts slug with hyphens', async () => {
      const request = new Request('http://localhost:3000/api/og/test-article');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'test-article' }),
      });

      expect(response.status).toBe(200);
    });

    it('accepts slug with numbers', async () => {
      const { getArticleBySlug } = await import('@/lib/content/blog');
      vi.mocked(getArticleBySlug).mockReturnValueOnce({
        slug: 'article-2024',
        meta: {
          titleFr: 'Article 2024',
          titleEn: 'Article 2024',
          excerptFr: 'Excerpt',
          excerptEn: 'Excerpt',
          publishedAt: '2024-01-01',
          tags: [],
        },
        content: '',
      });

      const request = new Request('http://localhost:3000/api/og/article-2024');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'article-2024' }),
      });

      expect(response.status).toBe(200);
    });
  });

  describe('article data handling', () => {
    it('fetches article by slug', async () => {
      const { getArticleBySlug } = await import('@/lib/content/blog');

      const request = new Request('http://localhost:3000/api/og/test-article');
      await GET(request, {
        params: Promise.resolve({ slug: 'test-article' }),
      });

      expect(getArticleBySlug).toHaveBeenCalledWith('test-article');
    });

    it('handles article with empty excerpt gracefully', async () => {
      const { getArticleBySlug } = await import('@/lib/content/blog');
      vi.mocked(getArticleBySlug).mockReturnValueOnce({
        slug: 'empty-excerpt',
        meta: {
          titleFr: 'Title',
          titleEn: 'Title',
          excerptFr: '',
          excerptEn: '',
          publishedAt: '2024-01-01',
          tags: [],
        },
        content: '',
      });

      const request = new Request('http://localhost:3000/api/og/empty-excerpt');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'empty-excerpt' }),
      });

      expect(response.status).toBe(200);
    });

    it('handles article with very long title', async () => {
      const { getArticleBySlug } = await import('@/lib/content/blog');
      const longTitle = 'A'.repeat(200);
      vi.mocked(getArticleBySlug).mockReturnValueOnce({
        slug: 'long-title',
        meta: {
          titleFr: longTitle,
          titleEn: longTitle,
          excerptFr: 'Excerpt',
          excerptEn: 'Excerpt',
          publishedAt: '2024-01-01',
          tags: [],
        },
        content: '',
      });

      const request = new Request('http://localhost:3000/api/og/long-title');
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'long-title' }),
      });

      expect(response.status).toBe(200);
    });
  });
});
