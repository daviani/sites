import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubHeader } from '../../src/components/SubHeader';

// Mock useTranslation hook
vi.mock('../../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'footer.navigation': 'Navigation principale',
        'nav.blog.title': 'Blog',
        'nav.contact.title': 'Contact',
        'nav.about.title': 'À propos',
        'nav.cv.title': 'CV',
      };
      return translations[key] || key;
    },
  }),
  TranslationKey: {},
}));

describe('SubHeader', () => {
  const defaultItems = [
    { href: '/blog', labelKey: 'nav.blog.title' as const },
    { href: '/contact', labelKey: 'nav.contact.title' as const },
    { href: '/about', labelKey: 'nav.about.title' as const },
  ];

  describe('rendering', () => {
    it('renders navigation element', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigation principale');
    });

    it('renders all navigation items', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('À propos')).toBeInTheDocument();
    });

    it('renders items as links with correct href', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink).toHaveAttribute('href', '/blog');
    });
  });

  describe('active state', () => {
    it('marks current page with aria-current', () => {
      render(<SubHeader items={defaultItems} currentPath="/blog" />);
      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink).toHaveAttribute('aria-current', 'page');
    });

    it('applies active styles to current page', () => {
      render(<SubHeader items={defaultItems} currentPath="/blog" />);
      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink?.className).toContain('bg-nord-5');
    });

    it('marks nested routes as active', () => {
      render(<SubHeader items={defaultItems} currentPath="/blog/article-1" />);
      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark other pages as active', () => {
      render(<SubHeader items={defaultItems} currentPath="/blog" />);
      const contactLink = screen.getByText('Contact').closest('a');
      expect(contactLink).not.toHaveAttribute('aria-current');
    });

    it('applies inactive styles to non-current pages', () => {
      render(<SubHeader items={defaultItems} currentPath="/blog" />);
      const contactLink = screen.getByText('Contact').closest('a');
      expect(contactLink?.className).toContain('hover:text-nord-0');
    });
  });

  describe('separators', () => {
    it('does not show separators by default', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      expect(screen.queryByText('•')).not.toBeInTheDocument();
    });

    it('shows separators when showSeparators is true', () => {
      render(<SubHeader items={defaultItems} currentPath="/" showSeparators />);
      const separators = screen.getAllByText('•');
      expect(separators).toHaveLength(2); // Between 3 items
    });

    it('hides separators from screen readers', () => {
      render(<SubHeader items={defaultItems} currentPath="/" showSeparators />);
      const separator = screen.getAllByText('•')[0];
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not show separator after last item', () => {
      render(<SubHeader items={defaultItems} currentPath="/" showSeparators />);
      const separators = screen.getAllByText('•');
      expect(separators).toHaveLength(defaultItems.length - 1);
    });
  });

  describe('accessibility', () => {
    it('has proper focus styles on links', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      const link = screen.getByText('Blog').closest('a');
      expect(link?.className).toContain('focus:outline-none');
      expect(link?.className).toContain('focus:ring-2');
    });

    it('has fixed positioning', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('fixed');
    });

    it('has proper z-index', () => {
      render(<SubHeader items={defaultItems} currentPath="/" />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('z-40');
    });
  });

  describe('empty state', () => {
    it('renders empty nav when no items provided', () => {
      render(<SubHeader items={[]} currentPath="/" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      const list = screen.getByRole('list');
      expect(list.children).toHaveLength(0);
    });
  });
});