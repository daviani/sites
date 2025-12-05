/**
 * @jest-environment node
 */

import { GET } from '@/app/api/rss/route';

describe('RSS Feed API', () => {
  it('returns a valid RSS response', async () => {
    const response = await GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe(
      'application/rss+xml; charset=utf-8'
    );
  });

  it('returns valid XML structure', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain('<rss version="2.0"');
    expect(text).toContain('<channel>');
    expect(text).toContain('</channel>');
    expect(text).toContain('</rss>');
  });

  it('contains required channel elements', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<title>');
    expect(text).toContain('<link>');
    expect(text).toContain('<description>');
    expect(text).toContain('<language>fr</language>');
  });

  it('includes atom:link for self-reference', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(text).toContain('<atom:link');
    expect(text).toContain('rel="self"');
  });

  it('has proper cache headers', async () => {
    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=3600, s-maxage=3600'
    );
  });

  it('escapes XML special characters in content', async () => {
    const response = await GET();
    const text = await response.text();

    // Should not contain unescaped special chars in text content
    // (outside of CDATA or proper escaping)
    expect(text).not.toMatch(/<title>[^<]*[<>&][^<]*<\/title>/);
  });
});