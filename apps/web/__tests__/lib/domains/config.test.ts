import { describe, it, expect, vi } from 'vitest';
import {
  VALID_SUBDOMAINS,
  getSubdomain,
  getRewritePath,
} from '@/lib/domains/config';

describe('domains/config', () => {
  describe('VALID_SUBDOMAINS', () => {
    it('contains all expected subdomains', () => {
      const expected = [
        'blog',
        'about',
        'cv',
        'contact',
        'rdv',
        'photos',
        'legal',
        'accessibility',
        'sitemap',
        'help',
      ];
      expected.forEach((sub) => {
        expect(VALID_SUBDOMAINS).toContain(sub);
      });
    });
  });

  describe('getSubdomain', () => {
    it('returns null for plain localhost', () => {
      expect(getSubdomain('localhost')).toBeNull();
    });

    it('returns null for localhost with port', () => {
      expect(getSubdomain('localhost:3000')).toBeNull();
    });

    it('returns subdomain for subdomain.localhost', () => {
      expect(getSubdomain('blog.localhost:3000')).toBe('blog');
    });

    it('returns null for main production domain', () => {
      expect(getSubdomain('daviani.dev')).toBeNull();
    });

    it('returns null for www.daviani.dev', () => {
      expect(getSubdomain('www.daviani.dev')).toBeNull();
    });

    it('extracts subdomain from subdomain.daviani.dev', () => {
      expect(getSubdomain('blog.daviani.dev')).toBe('blog');
    });

    it('extracts subdomain from contact.daviani.dev', () => {
      expect(getSubdomain('contact.daviani.dev')).toBe('contact');
    });

    it('returns null for two-part hostname without subdomain', () => {
      expect(getSubdomain('example.com')).toBeNull();
    });
  });

  describe('getRewritePath', () => {
    it('returns /blog for valid subdomain blog', () => {
      expect(getRewritePath('blog')).toBe('/blog');
    });

    it('returns /contact for valid subdomain contact', () => {
      expect(getRewritePath('contact')).toBe('/contact');
    });

    it('returns null for invalid subdomain', () => {
      expect(getRewritePath('unknown')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getRewritePath('')).toBeNull();
    });
  });

  describe('getBaseUrl', () => {
    it('returns https://daviani.dev by default', async () => {
      vi.resetModules();
      vi.stubEnv('NEXT_PUBLIC_DOMAIN', '');
      vi.stubEnv('NEXT_PUBLIC_PROTOCOL', '');
      vi.stubEnv('NEXT_PUBLIC_PORT', '');
      const mod = await import('@/lib/domains/config');
      expect(mod.getBaseUrl()).toBe('https://daviani.dev');
      vi.unstubAllEnvs();
    });

    it('uses NEXT_PUBLIC_DOMAIN env var', async () => {
      vi.resetModules();
      vi.stubEnv('NEXT_PUBLIC_DOMAIN', 'example.com');
      vi.stubEnv('NEXT_PUBLIC_PROTOCOL', '');
      vi.stubEnv('NEXT_PUBLIC_PORT', '');
      const mod = await import('@/lib/domains/config');
      expect(mod.getBaseUrl()).toContain('example.com');
      vi.unstubAllEnvs();
    });

    it('uses NEXT_PUBLIC_PROTOCOL env var', async () => {
      vi.resetModules();
      vi.stubEnv('NEXT_PUBLIC_DOMAIN', '');
      vi.stubEnv('NEXT_PUBLIC_PROTOCOL', 'http');
      vi.stubEnv('NEXT_PUBLIC_PORT', '');
      const mod = await import('@/lib/domains/config');
      expect(mod.getBaseUrl()).toMatch(/^http:\/\//);
      vi.unstubAllEnvs();
    });

    it('appends port from NEXT_PUBLIC_PORT', async () => {
      vi.resetModules();
      vi.stubEnv('NEXT_PUBLIC_DOMAIN', '');
      vi.stubEnv('NEXT_PUBLIC_PROTOCOL', '');
      vi.stubEnv('NEXT_PUBLIC_PORT', '3000');
      const mod = await import('@/lib/domains/config');
      expect(mod.getBaseUrl()).toContain(':3000');
      vi.unstubAllEnvs();
    });
  });

  describe('getSubdomainUrl', () => {
    it('returns full subdomain URL', async () => {
      vi.resetModules();
      vi.stubEnv('NEXT_PUBLIC_DOMAIN', '');
      vi.stubEnv('NEXT_PUBLIC_PROTOCOL', '');
      vi.stubEnv('NEXT_PUBLIC_PORT', '');
      const mod = await import('@/lib/domains/config');
      expect(mod.getSubdomainUrl('blog')).toBe('https://blog.daviani.dev');
      vi.unstubAllEnvs();
    });

    it('includes port when configured', async () => {
      vi.resetModules();
      vi.stubEnv('NEXT_PUBLIC_DOMAIN', '');
      vi.stubEnv('NEXT_PUBLIC_PROTOCOL', '');
      vi.stubEnv('NEXT_PUBLIC_PORT', '3000');
      const mod = await import('@/lib/domains/config');
      expect(mod.getSubdomainUrl('blog')).toBe('https://blog.daviani.dev:3000');
      vi.unstubAllEnvs();
    });
  });
});
