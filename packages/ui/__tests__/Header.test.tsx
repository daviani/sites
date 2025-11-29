import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../src/components/Header';
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
];

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders with default logo text', () => {
      renderWithProviders(<Header />);
      expect(screen.getByText('Daviani')).toBeInTheDocument();
      expect(screen.getByText('dev')).toBeInTheDocument();
    });

    it('renders as header element', () => {
      const { container } = renderWithProviders(<Header />);
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('renders OwlLogo SVG', () => {
      const { container } = renderWithProviders(<Header />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('renders custom logo when provided', () => {
      renderWithProviders(<Header logo={<span>My Logo</span>} />);
      expect(screen.getByText('My Logo')).toBeInTheDocument();
      expect(screen.queryByText('Daviani')).not.toBeInTheDocument();
    });

    it('accepts custom className', () => {
      const { container } = renderWithProviders(<Header className="test-class" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('test-class');
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      const { container } = renderWithProviders(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('fixed');
      expect(header?.className).toContain('shadow-lg');
      expect(header?.className).toContain('rounded-[2.5rem]');
      expect(header?.className).toContain('transition-colors');
    });

    it('applies glassmorphism background', () => {
      const { container } = renderWithProviders(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('bg-white/40');
      expect(header?.className).toContain('backdrop-blur-md');
    });

    it('applies dark mode classes', () => {
      const { container } = renderWithProviders(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('dark:bg-nord-3/50');
    });
  });

  describe('Layout Structure', () => {
    it('has responsive max-width container', () => {
      const { container } = renderWithProviders(<Header />);
      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toBeInTheDocument();
    });

    it('has flex layout with justify-between', () => {
      const { container } = renderWithProviders(<Header />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('maintains fixed height', () => {
      const { container } = renderWithProviders(<Header />);
      const flexContainer = container.querySelector('.h-16');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Mobile Hamburger Menu', () => {
    it('renders hamburger button when navItems provided', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('hamburger button has aria-expanded false initially', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('clicking hamburger button opens mobile menu', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);

      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: /fermer le menu|close menu/i })).toBeInTheDocument();
    });

    it('mobile menu contains navigation links when open', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);

      const mobileMenu = document.getElementById('mobile-menu');
      expect(mobileMenu).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
    });

    it('clicking hamburger button twice closes the menu', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

      const closeButton = screen.getByRole('button', { name: /fermer le menu|close menu/i });
      fireEvent.click(closeButton);

      expect(screen.getByRole('button', { name: /ouvrir le menu|open menu/i })).toHaveAttribute('aria-expanded', 'false');
    });

    it('hamburger button has aria-controls pointing to mobile-menu', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });
      expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('hamburger button has focus ring classes', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });
      expect(hamburgerButton.className).toContain('focus:ring');
    });

    it('marks current page as active in mobile menu', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);

      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      expect(portfolioLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('DarkModeToggle Integration', () => {
    it('renders DarkModeToggle button', () => {
      renderWithProviders(<Header />);
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode|passer en mode sombre/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });
});
