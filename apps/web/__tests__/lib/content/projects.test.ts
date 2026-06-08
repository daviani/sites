import { describe, it, expect } from 'vitest';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
  getAllContributions,
} from '@/lib/content/projects';

describe('projects loader', () => {
  it('loads all seeded projects', () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(4);
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toEqual(expect.arrayContaining(['rodd', 'flairjob', 'daviani-dev', 'maasto']));
  });

  it('sorts featured first, then by order', () => {
    const projects = getAllProjects();
    const featured = projects.filter((p) => p.featured);
    const nonFeatured = projects.filter((p) => !p.featured);
    // tous les featured avant les non-featured
    const firstNonFeaturedIndex = projects.findIndex((p) => !p.featured);
    if (firstNonFeaturedIndex !== -1) {
      expect(projects.slice(0, firstNonFeaturedIndex).every((p) => p.featured)).toBe(true);
    }
    expect(featured.length + nonFeatured.length).toBe(projects.length);
  });

  it('exposes hasDetail = true only when a body exists', () => {
    expect(getProjectBySlug('daviani-dev')?.hasDetail).toBe(true); // a un corps
    expect(getProjectBySlug('flairjob')?.hasDetail).toBe(false); // pas de corps
  });

  it('parses structured fields (links, stack) of a project', () => {
    const dav = getProjectBySlug('daviani-dev');
    expect(dav).not.toBeNull();
    expect(dav?.stack).toContain('Next.js');
    expect(dav?.links.length).toBeGreaterThan(0);
    expect(dav?.links[0]).toHaveProperty('url');
  });

  it('returns null for an unknown slug', () => {
    expect(getProjectBySlug('does-not-exist')).toBeNull();
  });

  it('lists slugs for static params', () => {
    expect(getProjectSlugs()).toEqual(expect.arrayContaining(['rodd', 'daviani-dev']));
  });

  it('loads contributions sorted by order', () => {
    const contribs = getAllContributions();
    expect(contribs.length).toBeGreaterThanOrEqual(3);
    const orders = contribs.map((c) => c.order);
    expect([...orders]).toEqual([...orders].sort((a, b) => a - b));
    expect(contribs.map((c) => c.slug)).toContain('tulikettu');
  });
});
