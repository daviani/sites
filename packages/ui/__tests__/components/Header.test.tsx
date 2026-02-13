import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../src/components/Header';

// Mock OwlLogo
vi.mock('../../src/components/OwlLogo', () => ({
  OwlLogo: ({ size }: { size: number }) => <svg data-testid="owl-logo" width={size} />,
}));

describe('Header', () => {
  const defaultMenuLabels = {
    open: 'Ouvrir le menu',
    close: 'Fermer le menu',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders header element', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('renders default logo with home link', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const homeLink = screen.getByLabelText(/Retour à l'accueil/i);
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders custom logo when provided', () => {
      render(<Header logo={<div data-testid="custom-logo">Custom</div>} menuLabels={defaultMenuLabels} />);
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('uses custom homeUrl when provided', () => {
      render(<Header homeUrl="/custom" menuLabels={defaultMenuLabels} />);
      const homeLink = screen.getByLabelText(/Retour à l'accueil/i);
      expect(homeLink).toHaveAttribute('href', '/custom');
    });

    it('applies custom className', () => {
      render(<Header className="my-header" menuLabels={defaultMenuLabels} />);
      const header = document.querySelector('header');
      expect(header?.className).toContain('my-header');
    });
  });

  describe('desktop view', () => {
    it('renders actions in desktop area', () => {
      const actions = <button data-testid="dark-mode-toggle">Theme</button>;
      render(<Header actions={actions} menuLabels={defaultMenuLabels} />);
      const toggles = screen.getAllByTestId('dark-mode-toggle');
      expect(toggles.length).toBeGreaterThan(0);
    });
  });

  describe('mobile menu', () => {
    it('renders hamburger button', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button).toBeInTheDocument();
    });

    it('opens menu when hamburger is clicked', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      expect(screen.getByLabelText('Fermer le menu')).toBeInTheDocument();
    });

    it('closes menu when close button is clicked', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const openButton = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(openButton);

      const closeButton = screen.getByLabelText('Fermer le menu');
      fireEvent.click(closeButton);

      expect(screen.getByLabelText('Ouvrir le menu')).toBeInTheDocument();
    });

    it('has correct aria-expanded attribute', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(screen.getByLabelText('Fermer le menu')).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-controls pointing to mobile menu', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
    });
  });

  describe('navigation items', () => {
    const navItems = [
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ];

    it('renders navigation items in mobile menu', () => {
      render(<Header navItems={navItems} menuLabels={defaultMenuLabels} />);

      // Open mobile menu
      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('marks current page with aria-current', () => {
      render(<Header navItems={navItems} currentPath="/blog" menuLabels={defaultMenuLabels} />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink).toHaveAttribute('aria-current', 'page');
    });

    it('applies active styles to current page', () => {
      render(<Header navItems={navItems} currentPath="/blog" menuLabels={defaultMenuLabels} />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      const blogLink = screen.getByText('Blog').closest('a');
      expect(blogLink?.className).toContain('bg-nord-5');
    });

    it('closes menu when nav item is clicked', () => {
      render(<Header navItems={navItems} menuLabels={defaultMenuLabels} />);

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
      { href: '/help', label: 'Aide' },
    ];

    it('renders secondary navigation items with separator', () => {
      render(<Header secondaryNavItems={secondaryNavItems} menuLabels={defaultMenuLabels} />);

      const button = screen.getByLabelText('Ouvrir le menu');
      fireEvent.click(button);

      expect(screen.getByText('Aide')).toBeInTheDocument();
    });
  });

  describe('click outside to close', () => {
    it('closes menu when clicking outside header', () => {
      render(
        <div>
          <Header menuLabels={defaultMenuLabels} />
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
      render(<Header menuLabels={defaultMenuLabels} />);

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
      render(<Header menuLabels={defaultMenuLabels} />);
      const header = document.querySelector('header');
      expect(header?.className).toContain('fixed');
    });

    it('has proper z-index', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const header = document.querySelector('header');
      expect(header?.className).toContain('z-50');
    });

    it('hamburger button has focus styles', () => {
      render(<Header menuLabels={defaultMenuLabels} />);
      const button = screen.getByLabelText('Ouvrir le menu');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });
  });
});
