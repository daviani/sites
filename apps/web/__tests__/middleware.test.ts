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
    it('returns path for blog', () => {
      const url = getSubdomainUrl('blog');
      expect(url).toBe('/blog');
    });

    it('returns path for about', () => {
      const url = getSubdomainUrl('about');
      expect(url).toBe('/about');
    });

    it('returns path for cv', () => {
      const url = getSubdomainUrl('cv');
      expect(url).toBe('/cv');
    });

    it('returns path for contact', () => {
      const url = getSubdomainUrl('contact');
      expect(url).toBe('/contact');
    });

    it('returns path for rdv', () => {
      const url = getSubdomainUrl('rdv');
      expect(url).toBe('/rdv');
    });

    it('returns path for legal', () => {
      const url = getSubdomainUrl('legal');
      expect(url).toBe('/legal');
    });
  });
});
