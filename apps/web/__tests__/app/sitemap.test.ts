import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { getBaseUrl } from '@/lib/domains/config';
import { getAllArticles } from '@/lib/content/blog';
import { getProjectSlugs, getContributionSlugs } from '@/lib/content/projects';

describe('sitemap', () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  const base = getBaseUrl();

  it('includes the key static pages', () => {
    expect(urls).toContain(base);
    expect(urls).toContain(`${base}/blog`);
    expect(urls).toContain(`${base}/projets`);
  });

  it('has no duplicate URLs and all start with the base URL', () => {
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((u) => u.startsWith(base))).toBe(true);
  });

  it('keeps every priority within [0, 1]', () => {
    expect(entries.every((e) => e.priority === undefined || (e.priority >= 0 && e.priority <= 1))).toBe(true);
  });

  it('lists every dynamic route (articles, projets, contributions)', () => {
    const expectedDynamic = [
      ...getAllArticles().map((a) => `${base}/blog/${a.slug}`),
      ...getProjectSlugs().map((s) => `${base}/projets/${s}`),
      ...getContributionSlugs().map((s) => `${base}/contributions/${s}`),
    ];

    // garde-fou : on teste bien quelque chose (du contenu existe)
    expect(expectedDynamic.length).toBeGreaterThan(0);

    // tout contenu publié doit figurer dans le sitemap…
    for (const url of expectedDynamic) {
      expect(urls).toContain(url);
    }

    // …et le sitemap ne doit pas contenir de route dynamique fantôme :
    // l'ensemble des routes dynamiques du sitemap == l'ensemble attendu.
    const dynamicInSitemap = urls.filter(
      (u) =>
        u.startsWith(`${base}/blog/`) ||
        u.startsWith(`${base}/projets/`) ||
        u.startsWith(`${base}/contributions/`)
    );
    expect(new Set(dynamicInSitemap)).toEqual(new Set(expectedDynamic));
  });

  it('date les pages statiques avec la constante de refonte (2026-06-17)', () => {
    const home = entries.find((e) => e.url === base);
    expect(home?.lastModified).toBeInstanceOf(Date);
    expect((home!.lastModified as Date).toISOString().slice(0, 10)).toBe('2026-06-17');
  });

  it("n'utilise jamais la date de build (aujourd'hui) comme lastmod", () => {
    // Régression : avant le fix, statiques/projets/contributions étaient datés à new Date() (build).
    const today = new Date().toISOString().slice(0, 10);
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect((entry.lastModified as Date).toISOString().slice(0, 10)).not.toBe(today);
    }
  });
});
