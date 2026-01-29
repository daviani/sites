import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCookieDomain } from '../../src/utils/cookies';

describe('getCookieDomain', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset window mock before each test
  });

  afterEach(() => {
    // Restore original window
    vi.unstubAllGlobals();
  });

  describe('server-side rendering', () => {
    it('returns empty string when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      expect(getCookieDomain()).toBe('');
    });
  });

  describe('localhost', () => {
    it('returns empty string for plain localhost', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'localhost' },
      });
      expect(getCookieDomain()).toBe('');
    });

    it('returns localhost for subdomain.localhost', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'blog.localhost' },
      });
      expect(getCookieDomain()).toBe('localhost');
    });

    it('returns localhost for deeply nested subdomain.localhost', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'api.v2.localhost' },
      });
      expect(getCookieDomain()).toBe('localhost');
    });
  });

  describe('production domains', () => {
    it('returns .daviani.dev for daviani.dev', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'daviani.dev' },
      });
      expect(getCookieDomain()).toBe('.daviani.dev');
    });

    it('returns .daviani.dev for blog.daviani.dev', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'blog.daviani.dev' },
      });
      expect(getCookieDomain()).toBe('.daviani.dev');
    });

    it('returns .daviani.dev for contact.daviani.dev', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'contact.daviani.dev' },
      });
      expect(getCookieDomain()).toBe('.daviani.dev');
    });

    it('returns .example.com for www.example.com', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'www.example.com' },
      });
      expect(getCookieDomain()).toBe('.example.com');
    });

    it('returns .example.com for deeply nested subdomain', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'api.v2.example.com' },
      });
      expect(getCookieDomain()).toBe('.example.com');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for single-part hostname', () => {
      vi.stubGlobal('window', {
        location: { hostname: 'myhost' },
      });
      expect(getCookieDomain()).toBe('');
    });
  });
});