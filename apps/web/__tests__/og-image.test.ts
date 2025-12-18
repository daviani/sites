// Mock Response class for edge runtime
class MockResponse {
  status: number;
  headers: Map<string, string>;
  body: string;

  constructor(body: string, init?: { status?: number; headers?: Headers | Record<string, string> }) {
    this.body = body;
    this.status = init?.status ?? 200;
    this.headers = new Map();
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((value, key) => this.headers.set(key, value));
      } else {
        Object.entries(init.headers).forEach(([key, value]) => this.headers.set(key, value));
      }
    }
  }
}

// Mock next/og before importing the route
jest.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {
    status: number;
    headers: {
      get: (key: string) => string | undefined;
    };

    constructor(_element: React.ReactElement, options?: { width?: number; height?: number; headers?: Record<string, string> }) {
      this.status = 200;
      const headersMap = new Map<string, string>();
      headersMap.set('content-type', 'image/png');
      if (options?.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headersMap.set(key.toLowerCase(), value);
        });
      }
      this.headers = {
        get: (key: string) => headersMap.get(key.toLowerCase()),
      };
    }
  },
}));

// Polyfill Response for tests
// @ts-expect-error - polyfill for Jest
global.Response = MockResponse;

import { GET } from '@/app/api/og/[slug]/route';

describe('OG Image Route', () => {
  const createRequest = (slug: string) => ({
    url: `http://localhost:3000/api/og/${slug}`,
  });

  // Use an existing article slug for tests
  const validSlug = 'introduction-devops';

  describe('GET /api/og/[slug]', () => {
    it('returns 200 for valid article slug', async () => {
      const request = createRequest(validSlug);
      const response = await GET(request as Request, { params: Promise.resolve({ slug: validSlug }) });

      expect(response.status).toBe(200);
    });

    it('returns 404 for non-existent article', async () => {
      const request = createRequest('non-existent-article');
      const response = await GET(request as Request, { params: Promise.resolve({ slug: 'non-existent-article' }) });

      expect(response.status).toBe(404);
    });

    it('returns correct content-type for valid article', async () => {
      const request = createRequest(validSlug);
      const response = await GET(request as Request, { params: Promise.resolve({ slug: validSlug }) });

      expect(response.headers.get('content-type')).toBe('image/png');
    });

    it('returns cache headers for performance', async () => {
      const request = createRequest(validSlug);
      const response = await GET(request as Request, { params: Promise.resolve({ slug: validSlug }) });

      expect(response.headers.get('cache-control')).toContain('max-age');
    });
  });
});
