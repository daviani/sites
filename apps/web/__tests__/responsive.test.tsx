/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from './helpers/test-utils';
import { Header, Footer, SubHeader } from '@daviani/ui';
import { HeroSection } from '@/components/HeroSection';

const navItems = [
  { href: '/portfolio', labelKey: 'nav.portfolio.title' as const },
  { href: '/blog', labelKey: 'nav.blog.title' as const },
  { href: '/cv', labelKey: 'nav.cv.title' as const },
];

describe('Responsive Design Tests', () => {
  // ============================================
  // HEADER RESPONSIVE
  // ============================================
  describe('Header Responsive', () => {
    it('hamburger button has md:hidden class (visible on mobile only)', () => {
      const { container } = render(<Header navItems={navItems} />);
      const hamburgerContainer = container.querySelector('.md\\:hidden');
      expect(hamburgerContainer).toBeInTheDocument();
    });

    it('desktop actions container has hidden md:flex classes', () => {
      const { container } = render(<Header />);
      const desktopActions = container.querySelector('.hidden.md\\:flex');
      expect(desktopActions).toBeInTheDocument();
    });

    it('hamburger button toggles mobile menu', () => {
      render(<Header navItems={navItems} />);

      // Mobile menu should not be visible initially
      expect(screen.queryByRole('list')).not.toBeInTheDocument();

      // Click hamburger button
      const hamburgerButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(hamburgerButton);

      // Mobile menu should now be visible
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('mobile menu closes when hamburger is clicked again', () => {
      render(<Header navItems={navItems} />);

      const hamburgerButton = screen.getByRole('button', { name: /menu/i });

      // Open menu
      fireEvent.click(hamburgerButton);
      expect(screen.getByRole('list')).toBeInTheDocument();

      // Close menu
      fireEvent.click(hamburgerButton);
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('mobile menu has md:hidden class', () => {
      const { container } = render(<Header navItems={navItems} />);

      // Open mobile menu
      const hamburgerButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(hamburgerButton);

      const mobileMenu = container.querySelector('#mobile-menu');
      expect(mobileMenu).toHaveClass('md:hidden');
    });

    it('header has responsive padding classes', () => {
      const { container } = render(<Header />);
      const innerDiv = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8');
      expect(innerDiv).toBeInTheDocument();
    });

    it('navigation links close mobile menu on click', () => {
      render(<Header navItems={navItems} currentPath="/" />);

      // Open mobile menu
      const hamburgerButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(hamburgerButton);

      // Click a navigation link
      const navLinks = screen.getAllByRole('link');
      const portfolioLink = navLinks.find(link => link.getAttribute('href') === '/portfolio');
      if (portfolioLink) {
        fireEvent.click(portfolioLink);
      }

      // Menu should be closed
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // SUBHEADER RESPONSIVE
  // ============================================
  describe('SubHeader Responsive', () => {
    it('has hidden md:block classes (hidden on mobile, visible on desktop)', () => {
      const { container } = render(
        <SubHeader items={navItems} currentPath="/portfolio" />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('hidden');
      expect(nav).toHaveClass('md:block');
    });

    it('is positioned below header with correct top offset', () => {
      const { container } = render(
        <SubHeader items={navItems} currentPath="/portfolio" />
      );
      const nav = container.querySelector('nav');
      expect(nav?.className).toMatch(/top-\[86px\]/);
    });

    it('has lower z-index than header (z-40 vs z-50)', () => {
      const { container } = render(
        <SubHeader items={navItems} currentPath="/portfolio" />
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('z-40');
    });

    it('navigation list uses horizontal flexbox layout', () => {
      const { container } = render(
        <SubHeader items={navItems} currentPath="/portfolio" />
      );
      const ul = container.querySelector('ul');
      expect(ul).toHaveClass('flex');
    });
  });

  // ============================================
  // FOOTER RESPONSIVE
  // ============================================
  describe('Footer Responsive', () => {
    const footerProps = {
      legalUrl: '/legal',
      contactUrl: '/contact',
      githubUrl: 'https://github.com/test',
      linkedinUrl: 'https://linkedin.com/in/test',
    };

    it('renders all links correctly', () => {
      render(<Footer {...footerProps} />);

      // Check for links (mobile and desktop versions)
      expect(screen.getAllByRole('link', { name: /legal|mentions/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: /github/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: /linkedin/i }).length).toBeGreaterThan(0);
    });

    it('uses grid layout for 3 columns on desktop', () => {
      const { container } = render(<Footer {...footerProps} />);
      const gridContainer = container.querySelector('.hidden.md\\:grid.grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has container with responsive padding', () => {
      const { container } = render(<Footer {...footerProps} />);
      const innerContainer = container.querySelector('.container.mx-auto.px-4');
      expect(innerContainer).toBeInTheDocument();
    });

    it('has rounded corners matching header style', () => {
      const { container } = render(<Footer {...footerProps} />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toMatch(/rounded-\[2\.5rem\]/);
    });
  });

  // ============================================
  // HERO SECTION RESPONSIVE
  // ============================================
  describe('HeroSection Responsive', () => {
    it('renders correctly', () => {
      render(<HeroSection />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('h1 has responsive text sizes (text-5xl md:text-6xl)', () => {
      const { container } = render(<HeroSection />);
      const h1 = container.querySelector('h1');
      expect(h1?.className).toMatch(/text-5xl/);
      expect(h1?.className).toMatch(/md:text-6xl/);
    });

    it('subtitle has responsive text sizes', () => {
      const { container } = render(<HeroSection />);
      const subtitle = container.querySelector('p.text-xl');
      expect(subtitle?.className).toMatch(/text-xl/);
      expect(subtitle?.className).toMatch(/md:text-2xl/);
    });

    it('section uses centered text layout', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('text-center');
    });

    it('logo container uses flexbox centering', () => {
      const { container } = render(<HeroSection />);
      const logoContainer = container.querySelector('.flex.justify-center');
      expect(logoContainer).toBeInTheDocument();
    });
  });

  // ============================================
  // BREAKPOINT PATTERNS
  // ============================================
  describe('Tailwind Breakpoint Patterns', () => {
    it('components use standard Tailwind breakpoints (sm, md, lg)', () => {
      const { container: headerContainer } = render(<Header navItems={navItems} />);
      const { container: subHeaderContainer } = render(
        <SubHeader items={navItems} currentPath="/" />
      );

      // Check for sm: prefix usage
      expect(headerContainer.innerHTML).toMatch(/sm:/);

      // Check for md: prefix usage
      expect(headerContainer.innerHTML).toMatch(/md:/);
      expect(subHeaderContainer.innerHTML).toMatch(/md:/);

      // Check for lg: prefix usage
      expect(headerContainer.innerHTML).toMatch(/lg:/);
    });

    it('mobile-first approach: base styles without prefix, desktop with md:', () => {
      const { container } = render(<Header />);

      // hidden md:flex pattern (hidden by default, flex on md+)
      expect(container.querySelector('.hidden.md\\:flex')).toBeInTheDocument();

      // md:hidden pattern (visible by default, hidden on md+)
      expect(container.querySelector('.md\\:hidden')).toBeInTheDocument();
    });
  });
});
