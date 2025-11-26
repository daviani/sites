import { NextRequest } from 'next/server';

// Import will fail until we implement the middleware
// This is the RED phase of TDD
import { getSubdomain, getRewritePath } from '@/lib/domains/config';

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

    it('returns subdomain for portfolio.daviani.dev', () => {
      expect(getSubdomain('portfolio.daviani.dev')).toBe('portfolio');
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

    it('returns /portfolio for portfolio subdomain', () => {
      expect(getRewritePath('portfolio')).toBe('/portfolio');
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
});
