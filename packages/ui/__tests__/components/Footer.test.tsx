import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../src/components/Footer';

describe('Footer', () => {
  const defaultTranslations = {
    legalNotice: 'Mentions légales',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    navigation: 'Navigation',
    infos: 'Informations',
    links: 'Liens',
    copyright: '© {year} Daviani. Tous droits réservés.',
    sitemap: 'Plan du site',
    help: 'Aide',
    accessibility: 'Accessibilité',
  };

  const defaultProps = {
    legalUrl: '/legal',
    accessibilityUrl: '/accessibility',
    githubUrl: 'https://github.com/daviani',
    linkedinUrl: 'https://linkedin.com/in/daviani',
    translations: defaultTranslations,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders footer element', () => {
      render(<Footer {...defaultProps} />);
      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('renders legal notice link', () => {
      render(<Footer {...defaultProps} />);
      const links = screen.getAllByText('Mentions légales');
      expect(links.length).toBeGreaterThan(0);
      expect(links[0].closest('a')).toHaveAttribute('href', '/legal');
    });

    it('renders GitHub link with external attributes', () => {
      render(<Footer {...defaultProps} />);
      const links = screen.getAllByText('GitHub');
      const link = links[0].closest('a');
      expect(link).toHaveAttribute('href', 'https://github.com/daviani');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders LinkedIn link with external attributes', () => {
      render(<Footer {...defaultProps} />);
      const links = screen.getAllByText('LinkedIn');
      const link = links[0].closest('a');
      expect(link).toHaveAttribute('href', 'https://linkedin.com/in/daviani');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders copyright with current year', () => {
      render(<Footer {...defaultProps} />);
      const copyrights = screen.getAllByText(/© 2025/);
      expect(copyrights.length).toBeGreaterThan(0);
    });
  });

  describe('optional links', () => {
    it('renders sitemap link when provided', () => {
      render(<Footer {...defaultProps} sitemapUrl="/sitemap" />);
      const link = screen.getByText('Plan du site');
      expect(link.closest('a')).toHaveAttribute('href', '/sitemap');
    });

    it('renders help link when provided', () => {
      render(<Footer {...defaultProps} helpUrl="/help" />);
      const link = screen.getByText('Aide');
      expect(link.closest('a')).toHaveAttribute('href', '/help');
    });

    it('does not render sitemap link when not provided', () => {
      render(<Footer {...defaultProps} />);
      // sitemap text only appears if sitemapUrl is also provided
      const sitemapLinks = screen.queryAllByText('Plan du site');
      // Without sitemapUrl prop, the link should not render even if translation exists
      const sitemapAnchors = sitemapLinks.filter(el => el.closest('a'));
      expect(sitemapAnchors).toHaveLength(0);
    });

    it('does not render help link when not provided', () => {
      render(<Footer {...defaultProps} />);
      const helpLinks = screen.queryAllByText('Aide');
      const helpAnchors = helpLinks.filter(el => el.closest('a'));
      expect(helpAnchors).toHaveLength(0);
    });
  });

  describe('desktop layout', () => {
    it('renders three column headers', () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Informations')).toBeInTheDocument();
      expect(screen.getByText('Liens')).toBeInTheDocument();
    });

    it('renders accessibility link in infos column', () => {
      render(<Footer {...defaultProps} />);
      const link = screen.getByText('Accessibilité');
      expect(link.closest('a')).toHaveAttribute('href', '/accessibility');
    });
  });

  describe('accessibility', () => {
    it('links have proper focus styles', () => {
      render(<Footer {...defaultProps} />);
      const links = screen.getAllByText('Mentions légales');
      const link = links[0].closest('a');
      expect(link?.className).toContain('focus:outline-none');
      expect(link?.className).toContain('focus:ring-2');
    });

    it('uses semantic footer element', () => {
      render(<Footer {...defaultProps} />);
      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('uses div elements for column titles (not headings to avoid hierarchy skip)', () => {
      render(<Footer {...defaultProps} />);
      const headings = document.querySelectorAll('h3');
      expect(headings.length).toBe(0);
    });
  });
});
