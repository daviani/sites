import { screen, fireEvent, renderWithProviders } from './helpers/test-utils';
import { Header } from '../src';

const mockNavItems = [
  { href: '/portfolio', labelKey: 'nav.portfolio.title' as const },
  { href: '/blog', labelKey: 'nav.blog.title' as const },
];

const mockSecondaryNavItems = [
  { href: '/accessibility', labelKey: 'nav.accessibility.title' as const },
  { href: '/sitemap', labelKey: 'nav.sitemap.title' as const },
  { href: '/help', labelKey: 'nav.help.title' as const },
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

  describe('Secondary Navigation Items', () => {
    it('renders secondary nav items in mobile menu when provided', () => {
      renderWithProviders(
        <Header
          navItems={mockNavItems}
          secondaryNavItems={mockSecondaryNavItems}
          currentPath="/portfolio"
        />
      );
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);

      expect(screen.getByRole('link', { name: /accessibilit[eé]|accessibility/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /plan du site|sitemap/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /aide|help/i })).toBeInTheDocument();
    });

    it('secondary nav items have smaller text', () => {
      renderWithProviders(
        <Header
          navItems={mockNavItems}
          secondaryNavItems={mockSecondaryNavItems}
          currentPath="/portfolio"
        />
      );
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);

      const accessibilityLink = screen.getByRole('link', { name: /accessibilit[eé]|accessibility/i });
      expect(accessibilityLink.className).toContain('text-xs');
    });

    it('secondary nav items appear after primary nav items', () => {
      renderWithProviders(
        <Header
          navItems={mockNavItems}
          secondaryNavItems={mockSecondaryNavItems}
          currentPath="/portfolio"
        />
      );
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);

      const links = screen.getAllByRole('link');
      const portfolioIndex = links.findIndex((link) => /portfolio/i.test(link.textContent || ''));
      const accessibilityIndex = links.findIndex((link) => /accessibilit/i.test(link.textContent || ''));
      expect(accessibilityIndex).toBeGreaterThan(portfolioIndex);
    });
  });

  describe('Click Outside to Close', () => {
    it('closes mobile menu when clicking outside header', () => {
      renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

      // Simulate click outside
      fireEvent.mouseDown(document.body);

      expect(screen.getByRole('button', { name: /ouvrir le menu|open menu/i })).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not close menu when clicking inside header', () => {
      const { container } = renderWithProviders(<Header navItems={mockNavItems} currentPath="/portfolio" />);
      const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu|open menu/i });

      fireEvent.click(hamburgerButton);
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

      // Click inside the header
      const header = container.querySelector('header');
      if (header) {
        fireEvent.mouseDown(header);
      }

      expect(screen.getByRole('button', { name: /fermer le menu|close menu/i })).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
