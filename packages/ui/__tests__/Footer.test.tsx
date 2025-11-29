import { render, screen } from '@testing-library/react';
import { Footer } from '../src/components/Footer';
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

describe('Footer Component', () => {
  const mockLegalUrl = '/legal';
  const mockContactUrl = '/contact';
  const mockGithubUrl = 'https://github.com/daviani';
  const mockLinkedinUrl = 'https://linkedin.com/in/daviani';

  const defaultProps = {
    legalUrl: mockLegalUrl,
    contactUrl: mockContactUrl,
    githubUrl: mockGithubUrl,
    linkedinUrl: mockLinkedinUrl,
  };

  describe('Rendering', () => {
    it('renders footer element', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders legal notice link', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const legalLink = screen.getByRole('link', { name: /l[eé]gal|mentions|notice/i });
      expect(legalLink).toBeInTheDocument();
      expect(legalLink).toHaveAttribute('href', mockLegalUrl);
    });

    it('renders column titles', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      expect(screen.getByRole('heading', { name: /navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /l[eé]gal/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
    });

    it('renders contact link', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', mockContactUrl);
    });

    it('renders GitHub link', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', mockGithubUrl);
    });

    it('renders LinkedIn link', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', mockLinkedinUrl);
    });

    it('renders copyright text with current year', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
      expect(screen.getByText(/daviani\.dev/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA landmark', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('GitHub link opens in new tab with security attributes', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('LinkedIn link opens in new tab with security attributes', () => {
      renderWithProviders(<Footer {...defaultProps} />);
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
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
      const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });
  });
});
