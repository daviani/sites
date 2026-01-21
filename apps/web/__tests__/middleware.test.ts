import { NextRequest } from 'next/server';

import { getSubdomain, getRewritePath, getSubdomainUrl, getBaseUrl } from '@/lib/domains/config';

describe('Subdomain Routing', () => {
  describe('getSubdomain', () => {
    it('returns null for main domain', () => {
      expect(getSubdomain('daviani.dev')).toBeNull();
    });

    it('returns null for www subdomain', () => {
      expect(getSubdomain('www.daviani.dev')).toBeNull();
    });

    it('returns subdomain for blog.daviani.dev', () => {
      expect(getSubdomain('blog.daviani.dev')).toBe('blog');
    });

    it('returns subdomain for about.daviani.dev', () => {
      expect(getSubdomain('about.daviani.dev')).toBe('about');
    });

    it('returns subdomain for cv.daviani.dev', () => {
      expect(getSubdomain('cv.daviani.dev')).toBe('cv');
    });

    it('returns subdomain for contact.daviani.dev', () => {
      expect(getSubdomain('contact.daviani.dev')).toBe('contact');
    });

    it('returns subdomain for rdv.daviani.dev', () => {
      expect(getSubdomain('rdv.daviani.dev')).toBe('rdv');
    });

    it('returns subdomain for legal.daviani.dev', () => {
      expect(getSubdomain('legal.daviani.dev')).toBe('legal');
    });

    it('handles localhost with port for development', () => {
      expect(getSubdomain('blog.localhost:3000')).toBe('blog');
    });

    it('returns null for plain localhost', () => {
      expect(getSubdomain('localhost:3000')).toBeNull();
    });
  });

  describe('getRewritePath', () => {
    it('returns /blog for blog subdomain', () => {
      expect(getRewritePath('blog')).toBe('/blog');
    });

    it('returns /about for about subdomain', () => {
      expect(getRewritePath('about')).toBe('/about');
    });

    it('returns /cv for cv subdomain', () => {
      expect(getRewritePath('cv')).toBe('/cv');
    });

    it('returns /contact for contact subdomain', () => {
      expect(getRewritePath('contact')).toBe('/contact');
    });

    it('returns /rdv for rdv subdomain', () => {
      expect(getRewritePath('rdv')).toBe('/rdv');
    });

    it('returns /legal for legal subdomain', () => {
      expect(getRewritePath('legal')).toBe('/legal');
    });

    it('returns null for unknown subdomain', () => {
      expect(getRewritePath('unknown')).toBeNull();
    });
  });

  describe('getBaseUrl', () => {
    it('returns full URL with protocol and domain', () => {
      expect(getBaseUrl()).toMatch(/^https?:\/\/.*$/);
    });
  });

  describe('getSubdomainUrl', () => {
    it('returns full URL for blog subdomain', () => {
      const url = getSubdomainUrl('blog');
      expect(url).toContain('blog');
      expect(url).toMatch(/^https?:\/\//);
    });

    it('returns full URL for about subdomain', () => {
      const url = getSubdomainUrl('about');
      expect(url).toContain('about');
      expect(url).toMatch(/^https?:\/\//);
    });

    it('returns full URL for cv subdomain', () => {
      const url = getSubdomainUrl('cv');
      expect(url).toContain('cv');
      expect(url).toMatch(/^https?:\/\//);
    });

    it('returns full URL for contact subdomain', () => {
      const url = getSubdomainUrl('contact');
      expect(url).toContain('contact');
      expect(url).toMatch(/^https?:\/\//);
    });

    it('returns full URL for rdv subdomain', () => {
      const url = getSubdomainUrl('rdv');
      expect(url).toContain('rdv');
      expect(url).toMatch(/^https?:\/\//);
    });

    it('returns full URL for legal subdomain', () => {
      const url = getSubdomainUrl('legal');
      expect(url).toContain('legal');
      expect(url).toMatch(/^https?:\/\//);
    });
  });
});
