import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from '../../src/components/DarkModeToggle';

// Mock useTheme hook
const mockToggleTheme = vi.fn();
let mockTheme = 'light';
let mockMounted = true;

vi.mock('../../src/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
    mounted: mockMounted,
    setTheme: vi.fn(),
  }),
}));

// Mock useTranslation hook
vi.mock('../../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'darkMode.switchToDark': 'Activer le mode sombre',
        'darkMode.switchToLight': 'Activer le mode clair',
      };
      return translations[key] || key;
    },
  }),
}));

describe('DarkModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = 'light';
    mockMounted = true;
  });

  describe('when mounted in light mode', () => {
    it('renders the toggle button', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has correct aria-label for light mode', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Activer le mode sombre');
    });

    it('calls toggleTheme when clicked', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('displays moon icon in light mode', () => {
      render(<DarkModeToggle />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has title attribute matching aria-label', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Activer le mode sombre');
    });
  });

  describe('when in dark mode', () => {
    beforeEach(() => {
      mockTheme = 'dark';
    });

    it('has correct aria-label for dark mode', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Activer le mode clair');
    });

    it('has title attribute for dark mode', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Activer le mode clair');
    });

    it('displays sun icon in dark mode', () => {
      render(<DarkModeToggle />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('when not mounted (SSR)', () => {
    beforeEach(() => {
      mockMounted = false;
    });

    it('renders disabled placeholder button', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
    });

    it('has placeholder aria-label', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Activer le mode sombre');
    });
  });

  describe('accessibility', () => {
    it('has proper focus styles', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });

    it('is keyboard accessible', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});