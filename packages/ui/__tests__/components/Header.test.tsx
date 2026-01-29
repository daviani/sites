import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../src/components/Header';

// Mock hooks
vi.mock('../../src/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
    mounted: true,
    setTheme: vi.fn(),
  }),
}));

vi.mock('../../src/hooks/use-language', () => ({
  useLanguage: () => ({
    language: 'fr',
    setLanguage: vi.fn(),
    mounted: true,
  }),
  Language: {},
}));

vi.mock('../../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.openMenu': 'Ouvrir le menu',
        'common.closeMenu': 'Fermer le menu',
        'nav.blog.title': 'Blog',
        'nav.contact.title': 'Contact',
        'nav.about.title': 'À propos',
        'nav.help.title': 'Aide',
      };
      return translations[key] || key;
    },
  }),
  TranslationKey: {},
}));

// Mock child components
vi.mock('../../src/components/DarkModeToggle', () => ({
  DarkModeToggle: () => <button data-testid="dark-mode-toggle">Theme</button>,
}));

vi.mock('../../src/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <button data-testid="language-switcher">Lang</button>,
}));

vi.mock('../../src/components/OwlLogo', () => ({
  OwlLogo: ({ size }: { size: number }) => <svg data-testid="owl-logo" width={size} />,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders header element', () => {
      render(<Header />);
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('renders default logo with home link', () => {
      render(<Header />);
      const homeLink = screen.getByLabelText(/Retour à l'accueil/i);
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders custom logo when provided', () => {
      render(<Header logo={<div data-testid="custom-logo">Custom</div>} />);
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('uses custom homeUrl when provided', () => {
      render(<Header homeUrl="/custom" />);
      const homeLink = screen.getByLabelText(/Retour à l'accueil/i);
      expect(homeLink).toHaveAttribute('href', '/custom');
    });

    it('applies custom className', () => {
      render(<Header className="my-header" />);
      const header = document.querySelector('header');
      expect(header?.className).toContain('my-header');
    });
  });

  describe('desktop view', () => {
    it('renders language switcher and dark mode toggle', () => {
      render(<Header />);
      // Both are rendered in desktop AND mobile views, but hidden/shown with CSS
      const toggles = screen.getAllByTestId('dark-mode-toggle');
      expect(toggles.length).toBeGreaterThan(0);
    });
  });

  describe('mobile menu', () => {
    it('renders hamburger button', () => {
      render(<Header />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button).toBeInTheDocument();
    });

    it('opens menu when hamburger is clicked', () => {
      render(<Header />);
      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      expect(screen.getByLabelText('Fermer le menu')).toBeInTheDocument();
    });

    it('closes menu when close button is clicked', () => {
      render(<Header />);
      const openButton = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(openButton);

      const closeButton = screen.getByLabelText('Fermer le menu');
      fireEvent.click(closeButton);

      expect(screen.getByLabelText('Ouvrir le menu')).toBeInTheDocument();
    });

    it('has correct aria-expanded attribute', () => {
      render(<Header />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(screen.getByLabelText('Fermer le menu')).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-controls pointing to mobile menu', () => {
      render(<Header />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
    });
  });

  describe('navigation items', () => {
    const navItems = [
      { href: '/blog', labelKey: 'nav.blog.title' as const },
      { href: '/contact', labelKey: 'nav.contact.title' as const },
    ];

    it('renders navigation items in mobile menu', () => {
      render(<Header navItems={navItems} />);

      // Open mobile menu
      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('marks current page with aria-current', () => {
      render(<Header navItems={navItems} currentPath="/blog" />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink).toHaveAttribute('aria-current', 'page');
    });

    it('applies active styles to current page', () => {
      render(<Header navItems={navItems} currentPath="/blog" />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink?.className).toContain('bg-nord-5');
    });

    it('closes menu when nav item is clicked', () => {
      render(<Header navItems={navItems} />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      const blogLink = screen.getByText('Blog');
      fireEvent.click(blogLink);

      // Menu should close
      expect(screen.getByLabelText('Ouvrir le menu')).toBeInTheDocument();
    });
  });

  describe('secondary navigation items', () => {
    const secondaryNavItems = [
      { href: '/help', labelKey: 'nav.help.title' as const },
    ];

    it('renders secondary navigation items with separator', () => {
      render(<Header secondaryNavItems={secondaryNavItems} />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      expect(screen.getByText('Aide')).toBeInTheDocument();
    });
  });

  describe('click outside to close', () => {
    it('closes menu when clicking outside header', () => {
      render(
        <div>
          <Header />
          <div data-testid="outside">Outside</div>
        </div>
      );

      // Open menu
      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(screen.getByLabelText('Ouvrir le menu')).toBeInTheDocument();
    });

    it('does not close when clicking inside header', () => {
      render(<Header />);

      // Open menu
      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      // Click inside header
      const header = document.querySelector('header');
      fireEvent.mouseDown(header!);

      // Menu should still be open
      expect(screen.getByLabelText('Fermer le menu')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has fixed position for visibility', () => {
      render(<Header />);
      const header = document.querySelector('header');
      expect(header?.className).toContain('fixed');
    });

    it('has proper z-index', () => {
      render(<Header />);
      const header = document.querySelector('header');
      expect(header?.className).toContain('z-50');
    });

    it('hamburger button has focus styles', () => {
      render(<Header />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });
  });
});