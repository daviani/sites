import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTop } from '../../src/components/ScrollToTop';

// Mock useTranslation hook
vi.mock('../../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.scrollToTop': 'Retour en haut',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ScrollToTop', () => {
  let mockScrollY = 0;
  const mockScrollTo = vi.fn();
  const mockMatchMedia = vi.fn();

  beforeEach(() => {
    mockScrollY = 0;
    vi.clearAllMocks();

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      get: () => mockScrollY,
      configurable: true,
    });

    // Mock window.scrollTo
    window.scrollTo = mockScrollTo;

    // Mock matchMedia
    mockMatchMedia.mockReturnValue({ matches: false });
    window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('visibility', () => {
    it('is hidden when scroll position is below 300px', () => {
      mockScrollY = 100;
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-0');
      expect(button.className).toContain('pointer-events-none');
    });

    it('becomes visible when scroll exceeds 300px', () => {
      render(<ScrollToTop />);

      // Simulate scroll
      mockScrollY = 400;
      fireEvent.scroll(window);

      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-100');
      expect(button.className).toContain('pointer-events-auto');
    });

    it('hides again when scrolled back up', () => {
      render(<ScrollToTop />);

      // Scroll down
      mockScrollY = 500;
      fireEvent.scroll(window);

      // Scroll back up
      mockScrollY = 100;
      fireEvent.scroll(window);

      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-0');
    });
  });

  describe('click behavior', () => {
    it('scrolls to top with smooth behavior by default', () => {
      mockScrollY = 500;
      render(<ScrollToTop />);
      fireEvent.scroll(window);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('scrolls to top with auto behavior when reduced motion is preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      mockScrollY = 500;

      render(<ScrollToTop />);
      fireEvent.scroll(window);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'auto',
      });
    });
  });

  describe('accessibility', () => {
    it('has correct aria-label', () => {
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Retour en haut');
    });

    it('has proper focus styles', () => {
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-4');
    });

    it('contains an arrow icon', () => {
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('styling', () => {
    it('has fixed positioning', () => {
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('fixed');
    });

    it('has correct z-index', () => {
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('z-50');
    });

    it('has hover scale effect', () => {
      render(<ScrollToTop />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:scale-110');
    });
  });

  describe('cleanup', () => {
    it('removes scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<ScrollToTop />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});