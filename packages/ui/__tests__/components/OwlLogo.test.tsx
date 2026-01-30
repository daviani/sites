import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { OwlLogo } from '../../src/components/OwlLogo';

// Mock useTheme hook
let mockTheme = 'light';
let mockMounted = true;

vi.mock('../../src/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    mounted: mockMounted,
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
  }),
}));

describe('OwlLogo', () => {
  beforeEach(() => {
    mockTheme = 'light';
    mockMounted = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders an SVG element', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has default size of 32', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('accepts custom size prop', () => {
      render(<OwlLogo size={48} />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('is hidden from screen readers', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('accepts custom className', () => {
      render(<OwlLogo className="custom-owl" />);
      const svg = document.querySelector('svg');
      expect(svg?.className.baseVal).toContain('custom-owl');
    });

    it('has correct viewBox', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
    });
  });

  describe('theme-based styling', () => {
    it('has transition classes for smooth theme changes', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      const group = svg?.querySelector('g');
      expect(group?.className.baseVal).toContain('transition-colors');
    });

    it('contains owl body path', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
    });

    it('contains eye circles', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      const circles = svg?.querySelectorAll('circle');
      expect(circles?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('animation on theme change', () => {
    it('does not animate on initial render', () => {
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      expect(svg?.className.baseVal).not.toContain('animate-bounce');
    });

    it('animates when theme changes', async () => {
      const { rerender } = render(<OwlLogo />);

      // Change theme
      mockTheme = 'dark';
      rerender(<OwlLogo />);

      const svg = document.querySelector('svg');
      expect(svg?.className.baseVal).toContain('animate-bounce');
    });

    it('stops animating after 600ms', async () => {
      const { rerender } = render(<OwlLogo />);

      // Change theme
      mockTheme = 'dark';
      rerender(<OwlLogo />);

      // Fast-forward past animation duration
      act(() => {
        vi.advanceTimersByTime(600);
      });

      const svg = document.querySelector('svg');
      expect(svg?.className.baseVal).not.toContain('animate-bounce');
    });
  });

  describe('unmounted state (SSR)', () => {
    it('renders without animation when not mounted', () => {
      mockMounted = false;
      render(<OwlLogo />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.className.baseVal).not.toContain('animate-bounce');
    });
  });
});