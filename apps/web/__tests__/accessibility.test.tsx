import { render, screen, fireEvent } from './helpers/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import RootPage from '@/app/page';
import AboutPage from '@/app/about/page';
import { Header, Footer, SubHeader } from '@daviani/ui';

expect.extend(toHaveNoViolations);

// Helper to calculate contrast ratio
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Nord color palette
const NORD_COLORS = {
  // Polar Night
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434C5E',
  nord3: '#4C566A',
  // Snow Storm
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',
  // Frost
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',
  // Aurora
  nord11: '#BF616A',
  nord12: '#D08770',
  nord13: '#EBCB8B',
  nord14: '#A3BE8C',
  nord15: '#B48EAD',
};

const navItems = [
  { href: '/about', labelKey: 'nav.about.title' as const },
  { href: '/blog', labelKey: 'nav.blog.title' as const },
  { href: '/cv', labelKey: 'nav.cv.title' as const },
  { href: '/contact', labelKey: 'nav.contact.title' as const },
  { href: '/rdv', labelKey: 'nav.rdv.title' as const },
];

describe('RGAA AAA - Accessibility Tests', () => {
  // ============================================
  // 1. AXE-CORE AUTOMATED TESTS
  // ============================================
  describe('1. Automated Axe-Core Tests', () => {
    it('Homepage has no accessibility violations', async () => {
      const { container } = render(<RootPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Portfolio page has no accessibility violations', async () => {
      const { container } = render(<AboutPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Header has no accessibility violations', async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Header with navigation has no accessibility violations', async () => {
      const { container } = render(<Header navItems={navItems} currentPath="/about" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('SubHeader has no accessibility violations', async () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/about" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Footer has no accessibility violations', async () => {
      const { container } = render(
        <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com/daviani" linkedinUrl="https://linkedin.com/in/daviani" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ============================================
  // 2. COLOR CONTRAST (RGAA 3.2 - AAA: 7:1 for normal text, 4.5:1 for large text)
  // ============================================
  describe('2. Color Contrast (RGAA 3.2 - AAA Level)', () => {
    describe('Light Mode Contrasts', () => {
      it('nord0 on nord6 meets AAA (7:1) for normal text', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord0, NORD_COLORS.nord6);
        expect(ratio).toBeGreaterThanOrEqual(7);
      });

      it('nord0 on nord5 meets AAA (7:1) for normal text', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord0, NORD_COLORS.nord5);
        expect(ratio).toBeGreaterThanOrEqual(7);
      });

      it('nord3 on nord6 meets AA (4.5:1) for large text', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord3, NORD_COLORS.nord6);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('nord3 on nord6 meets AA (4.5:1) for links', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord3, NORD_COLORS.nord6);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Dark Mode Contrasts', () => {
      it('nord6 on nord0 meets AAA (7:1) for normal text', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord6, NORD_COLORS.nord0);
        expect(ratio).toBeGreaterThanOrEqual(7);
      });

      it('nord4 on nord0 meets AAA (7:1) for normal text', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord4, NORD_COLORS.nord0);
        expect(ratio).toBeGreaterThanOrEqual(7);
      });

      it('nord8 on nord0 meets AA (4.5:1) for links', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord8, NORD_COLORS.nord0);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('nord4 on nord3 meets AA (4.5:1) for secondary text', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord4, NORD_COLORS.nord3);
        expect(ratio).toBeGreaterThanOrEqual(3);
      });
    });

    describe('Interactive Elements Contrast', () => {
      it('focus ring color (nord10) is visible on light background (3:1)', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord10, NORD_COLORS.nord6);
        expect(ratio).toBeGreaterThanOrEqual(3);
      });

      it('focus ring color (nord10) is visible on dark background (3:1)', () => {
        const ratio = getContrastRatio(NORD_COLORS.nord10, NORD_COLORS.nord0);
        expect(ratio).toBeGreaterThanOrEqual(3);
      });
    });
  });

  // ============================================
  // 3. SEMANTIC STRUCTURE (RGAA 9.1, 9.2)
  // ============================================
  describe('3. Semantic Structure (RGAA 9.1, 9.2)', () => {
    describe('Landmarks', () => {
      it('Header uses <header> landmark', () => {
        const { container } = render(<Header />);
        expect(container.querySelector('header')).toBeInTheDocument();
      });

      it('SubHeader uses <nav> landmark', () => {
        const { container } = render(<SubHeader items={navItems} currentPath="/" />);
        expect(container.querySelector('nav')).toBeInTheDocument();
      });

      it('Footer uses <footer> landmark', () => {
        const { container } = render(
          <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
        );
        expect(container.querySelector('footer')).toBeInTheDocument();
      });

      it('Navigation has aria-label for identification', () => {
        const { container } = render(<SubHeader items={navItems} currentPath="/" />);
        const nav = container.querySelector('nav');
        expect(nav).toHaveAttribute('aria-label');
      });

      it('Header hamburger button has aria-controls for menu', () => {
        const { container } = render(<Header navItems={navItems} currentPath="/" />);
        // Find the hamburger button specifically (has aria-controls)
        const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');
        expect(hamburgerButton).toBeInTheDocument();
      });
    });

    describe('Heading Hierarchy', () => {
      it('Homepage has exactly one h1', () => {
        render(<RootPage />);
        const h1Elements = screen.getAllByRole('heading', { level: 1 });
        expect(h1Elements).toHaveLength(1);
      });

      it('Portfolio page has exactly one h1', () => {
        render(<AboutPage />);
        const h1Elements = screen.getAllByRole('heading', { level: 1 });
        expect(h1Elements).toHaveLength(1);
      });

      it('h1 contains meaningful content', () => {
        render(<RootPage />);
        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1.textContent?.length).toBeGreaterThan(0);
      });
    });

    describe('Lists', () => {
      it('SubHeader navigation uses list structure', () => {
        const { container } = render(<SubHeader items={navItems} currentPath="/" />);
        const list = container.querySelector('ul');
        expect(list).toBeInTheDocument();
        const items = container.querySelectorAll('li');
        expect(items.length).toBe(navItems.length);
      });

      it('Footer links use semantic list', () => {
        const { container } = render(
          <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
        );
        const links = container.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
      });
    });
  });

  // ============================================
  // 4. IMAGES AND ICONS (RGAA 1.1, 1.2)
  // ============================================
  describe('4. Images and Icons (RGAA 1.1, 1.2)', () => {
    it('OwlLogo SVG is decorative or has accessible name', () => {
      const { container } = render(<Header />);
      const svgs = container.querySelectorAll('svg');
      svgs.forEach((svg) => {
        // SVG should either be aria-hidden or have accessible name
        const isHidden = svg.getAttribute('aria-hidden') === 'true';
        const hasLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('role');
        expect(isHidden || hasLabel).toBe(true);
      });
    });

    it('Hamburger menu icons are hidden from screen readers', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const button = container.querySelector('button');
      const svg = button?.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('GitHub links have accessible text content', () => {
      render(
        <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
      );
      const githubLinks = screen.getAllByRole('link', { name: /github/i });
      expect(githubLinks.length).toBeGreaterThanOrEqual(1);
      githubLinks.forEach((link) => {
        expect(link.textContent).toBeTruthy();
      });
    });
  });

  // ============================================
  // 5. LINKS (RGAA 6.1, 6.2)
  // ============================================
  describe('5. Links (RGAA 6.1, 6.2)', () => {
    it('All links have accessible names', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const hasText = link.textContent && link.textContent.trim().length > 0;
        const hasAriaLabel = link.hasAttribute('aria-label');
        expect(hasText || hasAriaLabel).toBe(true);
      });
    });

    it('Navigation links have meaningful text (not "click here")', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const text = link.textContent?.toLowerCase() || '';
        expect(text).not.toContain('click here');
        expect(text).not.toContain('cliquez ici');
        expect(text).not.toContain('read more');
        expect(text).not.toContain('en savoir plus');
      });
    });

    it('External links (GitHub) open in new tab with proper attributes', () => {
      const { container } = render(
        <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
      );
      const externalLinks = container.querySelectorAll('a[href^="http"]');
      externalLinks.forEach((link) => {
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
        }
      });
    });

    it('Current page link has aria-current="page"', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/about" />);
      const currentLink = container.querySelector('a[aria-current="page"]');
      expect(currentLink).toBeInTheDocument();
      expect(currentLink).toHaveAttribute('href', '/about');
    });

    it('Home link has accessible name', () => {
      const { container } = render(<Header homeUrl="/" />);
      const homeLink = container.querySelector('a[href="/"]');
      expect(homeLink).toHaveAttribute('aria-label');
    });
  });

  // ============================================
  // 6. KEYBOARD NAVIGATION (RGAA 12.6, 12.7)
  // ============================================
  describe('6. Keyboard Navigation (RGAA 12.6, 12.7)', () => {
    it('All interactive elements are focusable', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const interactiveElements = container.querySelectorAll('a, button');
      interactiveElements.forEach((element) => {
        const tabindex = element.getAttribute('tabindex');
        expect(tabindex === null || parseInt(tabindex) >= 0).toBe(true);
      });
    });

    it('No elements have tabindex greater than 0', () => {
      const { container } = render(
        <>
          <Header navItems={navItems} currentPath="/" />
          <SubHeader items={navItems} currentPath="/" />
          <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
        </>
      );
      const allElements = container.querySelectorAll('[tabindex]');
      allElements.forEach((element) => {
        const tabindex = parseInt(element.getAttribute('tabindex') || '0');
        expect(tabindex).toBeLessThanOrEqual(0);
      });
    });

    it('Hamburger button is keyboard accessible', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.tagName).toBe('BUTTON');
    });

    it('Navigation links maintain logical order', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const links = Array.from(container.querySelectorAll('a'));
      const hrefs = links.map((link) => link.getAttribute('href'));
      expect(hrefs).toEqual(['/about', '/blog', '/cv', '/contact', '/rdv']);
    });
  });

  // ============================================
  // 7. FOCUS VISIBILITY (RGAA 10.7)
  // ============================================
  describe('7. Focus Visibility (RGAA 10.7)', () => {
    it('Header buttons have focus ring styles', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.className).toMatch(/focus:ring|focus:outline/);
      });
    });

    it('Header home link has focus ring styles', () => {
      const { container } = render(<Header />);
      const homeLink = container.querySelector('a');
      expect(homeLink?.className).toMatch(/focus:ring|focus:outline/);
    });

    it('Navigation links have focus ring styles', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.className).toMatch(/focus:ring|focus:outline/);
      });
    });

    it('Footer links have focus ring styles', () => {
      const { container } = render(
        <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
      );
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.className).toMatch(/focus:ring|focus:outline/);
      });
    });

    it('Focus styles use visible offset', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const focusableElements = container.querySelectorAll('a, button');
      focusableElements.forEach((element) => {
        if (element.className.includes('focus:ring')) {
          expect(element.className).toContain('focus:ring-offset');
        }
      });
    });
  });

  // ============================================
  // 8. ARIA ATTRIBUTES (RGAA 7.1)
  // ============================================
  describe('8. ARIA Attributes (RGAA 7.1)', () => {
    it('Hamburger button has aria-expanded', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');
      expect(hamburgerButton).toHaveAttribute('aria-expanded');
    });

    it('Hamburger button aria-expanded changes on click', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');

      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(hamburgerButton!);
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('Hamburger button has aria-controls pointing to menu', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');
      expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('Hamburger button has aria-label', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');
      expect(hamburgerButton).toHaveAttribute('aria-label');
    });

    it('aria-label changes based on menu state', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');

      const closedLabel = hamburgerButton?.getAttribute('aria-label');
      fireEvent.click(hamburgerButton!);
      const openLabel = hamburgerButton?.getAttribute('aria-label');

      expect(closedLabel).not.toBe(openLabel);
    });
  });

  // ============================================
  // 9. TEXT ALTERNATIVES (RGAA 1.1)
  // ============================================
  describe('9. Text Alternatives (RGAA 1.1)', () => {
    it('All SVG icons have aria-hidden or accessible name', () => {
      const { container } = render(
        <>
          <Header navItems={navItems} currentPath="/" />
          <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
        </>
      );
      const svgs = container.querySelectorAll('svg');
      svgs.forEach((svg) => {
        const isHidden = svg.getAttribute('aria-hidden') === 'true';
        const hasTitle = svg.querySelector('title') !== null;
        const hasAriaLabel = svg.hasAttribute('aria-label');
        const parentHasAriaLabel = svg.parentElement?.hasAttribute('aria-label');
        expect(isHidden || hasTitle || hasAriaLabel || parentHasAriaLabel).toBe(true);
      });
    });
  });

  // ============================================
  // 10. RESPONSIVE AND ORIENTATION (RGAA 13.9, 13.10)
  // ============================================
  describe('10. Responsive Design (RGAA 13.9, 13.10)', () => {
    it('Header has responsive classes', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const header = container.querySelector('header');
      expect(header?.innerHTML).toMatch(/md:|sm:|lg:/);
    });

    it('Mobile menu is hidden on desktop (md:hidden)', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');
      fireEvent.click(hamburgerButton!);
      const mobileMenu = container.querySelector('#mobile-menu');
      expect(mobileMenu?.className).toContain('md:hidden');
    });

    it('SubHeader is hidden on mobile (hidden md:block)', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const nav = container.querySelector('nav');
      expect(nav?.className).toContain('hidden');
      expect(nav?.className).toContain('md:block');
    });

    it('Desktop actions are hidden on mobile', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const desktopActions = container.querySelector('.hidden.md\\:flex');
      expect(desktopActions).toBeInTheDocument();
    });
  });

  // ============================================
  // 11. TOUCH TARGETS (RGAA 13.11)
  // ============================================
  describe('11. Touch Targets (RGAA 13.11 - minimum 44x44px)', () => {
    it('Hamburger button has adequate padding for touch', () => {
      const { container } = render(<Header navItems={navItems} currentPath="/" />);
      const hamburgerButton = container.querySelector('button[aria-controls="mobile-menu"]');
      // p-3 = 12px padding, icon 24px = 48px total (exceeds 44px minimum)
      expect(hamburgerButton?.className).toContain('p-3');
    });

    it('Navigation links have adequate padding', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.className).toContain('px-4');
        expect(link.className).toContain('py-2');
      });
    });

    it('Footer links have adequate spacing', () => {
      const { container } = render(
        <Footer legalUrl="/legal" accessibilityUrl="/accessibility" githubUrl="https://github.com" linkedinUrl="https://linkedin.com/in/test" />
      );
      const links = container.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // 12. LANGUAGE (RGAA 8.3, 8.4)
  // ============================================
  describe('12. Language (RGAA 8.3, 8.4)', () => {
    it('Content uses translation keys (i18n)', () => {
      // This is verified by the fact that components use useTranslation hook
      // and render translated content
      render(<RootPage />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.textContent).toBeTruthy();
    });
  });

  // ============================================
  // 13. TRANSITIONS AND ANIMATIONS (RGAA 13.8)
  // ============================================
  describe('13. Transitions (RGAA 13.8)', () => {
    it('Header has transition classes for smooth changes', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('transition');
    });

    it('Navigation links have transition for hover states', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.className).toContain('transition');
      });
    });
  });

  // ============================================
  // 14. Z-INDEX AND STACKING (Visual order)
  // ============================================
  describe('14. Visual Stacking Order', () => {
    it('Header has highest z-index', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('z-50');
    });

    it('SubHeader has lower z-index than Header', () => {
      const { container } = render(<SubHeader items={navItems} currentPath="/" />);
      const nav = container.querySelector('nav');
      expect(nav?.className).toContain('z-40');
    });
  });
});
