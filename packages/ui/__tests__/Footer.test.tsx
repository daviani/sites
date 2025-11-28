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

  describe('Rendering', () => {
    it('renders footer element', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders legal link', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      const legalLink = screen.getByRole('link', { name: /l[eé]gal|mentions/i });
      expect(legalLink).toBeInTheDocument();
      expect(legalLink).toHaveAttribute('href', mockLegalUrl);
    });

    it('renders contact link', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', mockContactUrl);
    });

    it('renders GitHub link with icon', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', mockGithubUrl);
      expect(githubLink.querySelector('svg')).toBeInTheDocument();
    });

    it('renders copyright text with current year', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
      expect(screen.getByText(/daviani\.dev/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA landmark', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('GitHub link opens in new tab with security attributes', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Styling', () => {
    it('has dark mode classes', () => {
      renderWithProviders(
        <Footer legalUrl={mockLegalUrl} contactUrl={mockContactUrl} githubUrl={mockGithubUrl} />
      );
      const footer = screen.getByRole('contentinfo');
      expect(footer.className).toMatch(/dark:/);
    });
  });
});
