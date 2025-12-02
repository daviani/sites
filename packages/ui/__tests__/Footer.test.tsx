import { screen, renderWithProviders } from './helpers/test-utils';
import { Footer } from '../src';

describe('Footer Component', () => {
  const mockLegalUrl = '/legal';
  const mockAccessibilityUrl = '/accessibility';
  const mockGithubUrl = 'https://github.com/daviani';
  const mockLinkedinUrl = 'https://linkedin.com/in/daviani';

  const defaultProps = {
    legalUrl: mockLegalUrl,
    accessibilityUrl: mockAccessibilityUrl,
    githubUrl: mockGithubUrl,
    linkedinUrl: mockLinkedinUrl,
  };

  describe('Rendering', () => {
    it('renders footer element', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders legal notice links (mobile and desktop)', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const legalLinks = screen.getAllByRole('link', { name: /l[eé]gal|mentions|notice/i });
      expect(legalLinks.length).toBeGreaterThanOrEqual(1);
      legalLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', mockLegalUrl);
      });
    });

    it('renders column titles on desktop', () => {
      const { container } = renderWithProviders(<Footer {...defaultProps} />);
      // Titles are only visible on desktop (hidden md:grid)
      const desktopGrid = container.querySelector('.hidden.md\\:grid');
      expect(desktopGrid).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /infos?/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /links|suivre|follow/i })).toBeInTheDocument();
    });

    it('renders accessibility link on desktop', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const accessibilityLink = screen.getByRole('link', { name: /accessibilit[eé]|accessibility/i });
      expect(accessibilityLink).toHaveAttribute('href', mockAccessibilityUrl);
    });

    it('renders GitHub links (mobile and desktop)', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const githubLinks = screen.getAllByRole('link', { name: /github/i });
      expect(githubLinks.length).toBeGreaterThanOrEqual(1);
      githubLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', mockGithubUrl);
      });
    });

    it('renders LinkedIn links (mobile and desktop)', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const linkedinLinks = screen.getAllByRole('link', { name: /linkedin/i });
      expect(linkedinLinks.length).toBeGreaterThanOrEqual(1);
      linkedinLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', mockLinkedinUrl);
      });
    });

    it('renders copyright text with current year (mobile and desktop)', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const currentYear = new Date().getFullYear().toString();
      const yearElements = screen.getAllByText(new RegExp(currentYear));
      expect(yearElements.length).toBeGreaterThanOrEqual(1);
      const davianiElements = screen.getAllByText(/daviani\.dev/i);
      expect(davianiElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Accessibility', () => {
    it('GitHub links open in new tab with security attributes', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const githubLinks = screen.getAllByRole('link', { name: /github/i });
      githubLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('LinkedIn links open in new tab with security attributes', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const linkedinLinks = screen.getAllByRole('link', { name: /linkedin/i });
      linkedinLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Styling', () => {
    it('has dark mode classes', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const footer = screen.getByRole('contentinfo');
      expect(footer.className).toMatch(/dark:/);
    });

    it('uses 3-column grid layout on desktop', () => {
      const { container } = renderWithProviders(<Footer {...defaultProps} />);
      const desktopGrid = container.querySelector('.hidden.md\\:grid.grid-cols-3');
      expect(desktopGrid).toBeInTheDocument();
    });

    it('has compact mobile layout', () => {
      const { container } = renderWithProviders(<Footer {...defaultProps} />);
      const mobileLayout = container.querySelector('.md\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
    });
  });

  describe('Mobile Layout', () => {
    it('renders links inline on mobile', () => {
      const { container } = renderWithProviders(<Footer {...defaultProps} />);
      const mobileLayout = container.querySelector('.md\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
      // Mobile layout uses flex-wrap for inline display
      const flexContainer = mobileLayout?.querySelector('.flex.flex-wrap');
      expect(flexContainer).toBeInTheDocument();
    });

    it('has separators between mobile links', () => {
      const { container } = renderWithProviders(<Footer {...defaultProps} />);
      const mobileLayout = container.querySelector('.md\\:hidden');
      const separators = mobileLayout?.querySelectorAll('[aria-hidden="true"]');
      // 3 links = 2 separators
      expect(separators?.length).toBe(2);
    });

    it('separators have correct contrast colors', () => {
      const { container } = renderWithProviders(<Footer {...defaultProps} />);
      const mobileLayout = container.querySelector('.md\\:hidden');
      const separators = mobileLayout?.querySelectorAll('[aria-hidden="true"]');
      separators?.forEach((separator) => {
        expect(separator.className).toContain('text-nord-3');
        expect(separator.className).toContain('dark:text-nord-4');
      });
    });
  });
});
