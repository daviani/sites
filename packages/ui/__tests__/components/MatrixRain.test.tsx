import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MatrixRain } from '../../src/components/MatrixRain';

// Mock useMatrixRain hook
vi.mock('../../src/hooks/use-matrix-rain', () => ({
  useMatrixRain: vi.fn(),
}));

// Mock useTranslation hook
vi.mock('../../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'easterEggs.matrix.closeHint': 'Cliquez pour fermer',
      };
      return translations[key] || key;
    },
  }),
}));

describe('MatrixRain', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders nothing when not active', () => {
      const { container } = render(<MatrixRain isActive={false} />);
      expect(container.innerHTML).toBe('');
    });

    it('renders overlay when active', () => {
      render(<MatrixRain isActive={true} />);
      expect(screen.getByText('Cliquez pour fermer')).toBeInTheDocument();
    });

    it('renders a canvas element when active', () => {
      const { container } = render(<MatrixRain isActive={true} />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('has fixed positioning', () => {
      const { container } = render(<MatrixRain isActive={true} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain('fixed');
      expect(overlay.className).toContain('inset-0');
    });
  });

  describe('close behavior', () => {
    it('calls onClose when clicked', () => {
      const onClose = vi.fn();
      const { container } = render(<MatrixRain isActive={true} onClose={onClose} />);
      const overlay = container.firstChild as HTMLElement;
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose on Enter key', () => {
      const onClose = vi.fn();
      const { container } = render(<MatrixRain isActive={true} onClose={onClose} />);
      const overlay = container.firstChild as HTMLElement;
      fireEvent.keyDown(overlay, { key: 'Enter' });
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose on Escape key', () => {
      const onClose = vi.fn();
      render(<MatrixRain isActive={true} onClose={onClose} />);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose on other keys', () => {
      const onClose = vi.fn();
      render(<MatrixRain isActive={true} onClose={onClose} />);
      fireEvent.keyDown(window, { key: 'a' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('auto-close timer', () => {
    it('calls onClose after default duration (10s)', () => {
      const onClose = vi.fn();
      render(<MatrixRain isActive={true} onClose={onClose} />);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose after custom duration', () => {
      const onClose = vi.fn();
      render(<MatrixRain isActive={true} onClose={onClose} duration={5000} />);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not auto-close when duration is 0', () => {
      const onClose = vi.fn();
      render(<MatrixRain isActive={true} onClose={onClose} duration={0} />);

      act(() => {
        vi.advanceTimersByTime(20000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const onClose = vi.fn();
      const { unmount } = render(<MatrixRain isActive={true} onClose={onClose} />);
      unmount();

      act(() => {
        vi.advanceTimersByTime(15000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has aria-label for close hint', () => {
      const { container } = render(<MatrixRain isActive={true} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveAttribute('aria-label', 'Cliquez pour fermer');
    });

    it('has role button', () => {
      const { container } = render(<MatrixRain isActive={true} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveAttribute('role', 'button');
    });

    it('has tabIndex 0 for keyboard focus', () => {
      const { container } = render(<MatrixRain isActive={true} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveAttribute('tabindex', '0');
    });
  });
});