import { render, screen } from '@testing-library/react';
import { GitHubIcon } from '../src/components/icons/GitHubIcon';
import { ThemeProvider } from '../src/hooks/use-theme';
import { ReactNode } from 'react';

// Mock matchMedia
const matchMediaMock = (matches: boolean) => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('GitHubIcon', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn(() => matchMediaMock(false)),
    });
  });

  describe('Basic Rendering', () => {
    it('renders an SVG element', () => {
      render(<GitHubIcon data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      expect(svg.tagName.toLowerCase()).toBe('svg');
    });

    it('has correct default size', () => {
      render(<GitHubIcon data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('accepts custom size', () => {
      render(<GitHubIcon size={48} data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('accepts custom className', () => {
      render(<GitHubIcon className="custom-class" data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      expect(svg).toHaveClass('custom-class');
    });

    it('has aria-hidden by default', () => {
      render(<GitHubIcon data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Theme Variants', () => {
    it('renders dark variant when explicitly set', () => {
      render(<GitHubIcon variant="dark" data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      // Dark variant has dark background (#2E3440) and light icon (#ECEFF4)
      // Select the circle inside the <g> element (not the one in clipPath)
      const backgroundCircle = svg.querySelector('g > circle');
      expect(backgroundCircle).toHaveAttribute('fill', '#2E3440');
    });

    it('renders light variant when explicitly set', () => {
      render(<GitHubIcon variant="light" data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      // Light variant has light background (#ECEFF4) and dark icon (#2E3440)
      const backgroundCircle = svg.querySelector('g > circle');
      expect(backgroundCircle).toHaveAttribute('fill', '#ECEFF4');
    });

    it('auto-detects theme when variant is "auto"', () => {
      // In light mode (default mock)
      render(<GitHubIcon variant="auto" data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      // In light mode, icon should have light background
      const backgroundCircle = svg.querySelector('g > circle');
      expect(backgroundCircle).toHaveAttribute('fill', '#ECEFF4');
    });

    it('defaults to auto variant', () => {
      render(<GitHubIcon data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      // Default should be auto, so in light mode it shows light variant
      const backgroundCircle = svg.querySelector('g > circle');
      expect(backgroundCircle).toHaveAttribute('fill', '#ECEFF4');
    });
  });

  describe('GitHub Logo Shape', () => {
    it('contains the GitHub octocat path', () => {
      render(<GitHubIcon data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      const path = svg.querySelector('path');
      expect(path).toBeInTheDocument();
    });

    it('has clipPath for circular shape', () => {
      render(<GitHubIcon data-testid="github-icon" />, { wrapper: Wrapper });
      const svg = screen.getByTestId('github-icon');
      const clipPath = svg.querySelector('clipPath');
      expect(clipPath).toBeInTheDocument();
    });
  });
});
