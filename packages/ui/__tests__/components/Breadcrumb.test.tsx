import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem } from '../../src/components/Breadcrumb';

describe('Breadcrumb', () => {
  describe('rendering', () => {
    it('renders navigation with correct aria-label', () => {
      render(<Breadcrumb items={[]} ariaLabel="Fil d'Ariane" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', "Fil d'Ariane");
    });

    it('always includes home as first item', () => {
      render(<Breadcrumb items={[]} homeLabel="Accueil" />);
      const homeText = screen.getByText('Accueil');
      expect(homeText).toBeInTheDocument();
    });

    it('home is a link when there are other items', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Article" />);
      const homeLink = screen.getByText('Accueil').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders provided items', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Article" />);

      expect(screen.getByText('Accueil')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('renders multiple items in order', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
        { href: '/blog/article', label: 'À propos' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Mon Article" />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4); // Home + 2 items + currentLabel
    });
  });

  describe('separators', () => {
    it('renders separators between items', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Article" />);

      const separators = screen.getAllByText('\u203A');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('hides separators from screen readers', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Article" />);

      const separator = screen.getAllByText('\u203A')[0];
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('current page indicator', () => {
    it('marks last item as current page when no currentLabel', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" />);

      const currentPage = screen.getByText('Blog');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('renders currentLabel as the final item', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Mon Article" />);

      expect(screen.getByText('Mon Article')).toBeInTheDocument();
      expect(screen.getByText('Mon Article')).toHaveAttribute('aria-current', 'page');
    });

    it('makes previous items links when currentLabel is provided', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Mon Article" />);

      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink).toHaveAttribute('href', '/blog');
    });
  });

  describe('accessibility', () => {
    it('uses ordered list for semantic structure', () => {
      render(<Breadcrumb items={[]} homeLabel="Accueil" />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
    });

    it('links have proper focus styles', () => {
      const items: BreadcrumbItem[] = [
        { href: '/blog', label: 'Blog' },
      ];
      render(<Breadcrumb items={items} homeLabel="Accueil" currentLabel="Article" />);

      const link = screen.getByText('Blog').closest('a');
      expect(link?.className).toContain('focus:outline-none');
      expect(link?.className).toContain('focus:ring-2');
    });
  });
});
