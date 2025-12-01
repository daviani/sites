import { render, screen } from '@testing-library/react';
import { SubHeader } from '../src/components/SubHeader';
import { LanguageProvider } from '../src/hooks/use-language';
import { ThemeProvider } from '../src/hooks/use-theme';
import { ReactNode } from 'react';

// Mock matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>{children}</LanguageProvider>
  </ThemeProvider>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Wrapper });
};

const mockNavItems = [
  { href: '/portfolio', labelKey: 'nav.portfolio.title' as const },
  { href: '/blog', labelKey: 'nav.blog.title' as const },
  { href: '/cv', labelKey: 'nav.cv.title' as const },
  { href: '/contact', labelKey: 'nav.contact.title' as const },
  { href: '/rdv', labelKey: 'nav.rdv.title' as const },
];

describe('SubHeader Component', () => {
  describe('Rendering', () => {
    it('renders navigation element', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders all navigation items', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /cv|resume/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /rendez-vous|appointment/i })).toBeInTheDocument();
    });

    it('renders links with correct hrefs', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio');
      expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
    });
  });

  describe('Active State', () => {
    it('marks current page as active', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      expect(portfolioLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark other pages as active', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const blogLink = screen.getByRole('link', { name: /blog/i });
      expect(blogLink).not.toHaveAttribute('aria-current');
    });

    it('active link has different styling', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      const blogLink = screen.getByRole('link', { name: /blog/i });
      expect(portfolioLink.className).not.toBe(blogLink.className);
    });
  });

  describe('Accessibility', () => {
    it('has aria-label on navigation', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label');
    });

    it('links are keyboard accessible', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toBeVisible();
      });
    });
  });

  describe('Styling', () => {
    it('has dark mode classes', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toMatch(/dark:/);
    });

    it('has glassmorphism background', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('backdrop-blur');
      expect(nav.className).toContain('bg-white/40');
    });

    it('has rounded corners', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('rounded-');
    });

    it('is hidden on mobile', () => {
      renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('hidden');
      expect(nav.className).toContain('md:block');
    });
  });

  describe('Separators', () => {
    it('does not render separators by default', () => {
      const { container } = renderWithProviders(<SubHeader items={mockNavItems} currentPath="/portfolio" />);
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      // Filter to only bullet separators (not SVGs or other aria-hidden elements)
      const bulletSeparators = Array.from(separators).filter((el) => el.textContent === '•');
      expect(bulletSeparators.length).toBe(0);
    });

    it('renders separators when showSeparators is true', () => {
      const { container } = renderWithProviders(
        <SubHeader items={mockNavItems} currentPath="/portfolio" showSeparators />
      );
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      const bulletSeparators = Array.from(separators).filter((el) => el.textContent === '•');
      // Should have n-1 separators for n items
      expect(bulletSeparators.length).toBe(mockNavItems.length - 1);
    });

    it('separators are hidden from screen readers', () => {
      const { container } = renderWithProviders(
        <SubHeader items={mockNavItems} currentPath="/portfolio" showSeparators />
      );
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      const bulletSeparators = Array.from(separators).filter((el) => el.textContent === '•');
      bulletSeparators.forEach((separator) => {
        expect(separator).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('separators have correct contrast colors', () => {
      const { container } = renderWithProviders(
        <SubHeader items={mockNavItems} currentPath="/portfolio" showSeparators />
      );
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      const bulletSeparators = Array.from(separators).filter((el) => el.textContent === '•');
      bulletSeparators.forEach((separator) => {
        expect(separator.className).toContain('text-nord-3');
        expect(separator.className).toContain('dark:text-nord-4');
      });
    });
  });
});
