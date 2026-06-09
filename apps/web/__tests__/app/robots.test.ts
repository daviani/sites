import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';
import { getBaseUrl } from '@/lib/domains/config';

describe('robots', () => {
  it('allows all crawlers on the root', () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule?.userAgent).toBe('*');
    expect(rule?.allow).toBe('/');
  });

  it('blocks the Keystatic admin', () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule?.disallow).toContain('/keystatic');
    expect(rule?.disallow).toContain('/api/keystatic');
  });

  it('points to the sitemap and declares the host', () => {
    const r = robots();
    expect(r.sitemap).toBe(`${getBaseUrl()}/sitemap.xml`);
    expect(r.host).toBe(getBaseUrl());
  });
});
