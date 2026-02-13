import { describe, it, expect, vi } from 'vitest';

describe('domains/config', () => {
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
});
