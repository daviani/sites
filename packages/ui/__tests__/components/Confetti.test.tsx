import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { Confetti } from '../../src/components/Confetti';

describe('Confetti', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders nothing when not active', () => {
      const { container } = render(<Confetti isActive={false} />);
      expect(container.innerHTML).toBe('');
    });

    it('renders confetti pieces when active', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={10} />);
      const pieces = container.querySelectorAll('[style*="position: absolute"]');
      expect(pieces.length).toBe(10);
    });

    it('renders default 100 pieces', () => {
      const { container } = render(<Confetti isActive={true} />);
      const pieces = container.querySelectorAll('[style*="position: absolute"]');
      expect(pieces.length).toBe(100);
    });

    it('has fixed positioning overlay', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={5} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain('fixed');
      expect(overlay.className).toContain('inset-0');
    });

    it('is pointer-events-none', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={5} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain('pointer-events-none');
    });

    it('is aria-hidden', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={5} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });

    it('has high z-index', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={5} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.style.zIndex).toBe('9999');
    });
  });

  describe('confetti pieces', () => {
    it('pieces have background colors from Nord palette', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={50} />);
      const pieces = container.querySelectorAll('[style*="position: absolute"]');

      const usedColors = new Set<string>();
      pieces.forEach((piece) => {
        const bg = (piece as HTMLElement).style.backgroundColor;
        if (bg) usedColors.add(bg);
      });

      // Multiple distinct colors should be used
      expect(usedColors.size).toBeGreaterThan(1);
    });

    it('pieces have position, size and animation styles', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={5} />);
      const piece = container.querySelector('[style*="position: absolute"]') as HTMLElement;

      expect(piece.style.left).toMatch(/%$/);
      expect(piece.style.width).toBeTruthy();
      expect(piece.style.height).toBeTruthy();
      expect(piece.style.animation).toContain('confetti-fall');
      expect(piece.style.animation).toContain('confetti-shake');
    });
  });

  describe('lifecycle', () => {
    it('calls onComplete after duration', () => {
      const onComplete = vi.fn();
      render(<Confetti isActive={true} duration={3000} onComplete={onComplete} pieceCount={5} />);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onComplete).toHaveBeenCalledOnce();
    });

    it('clears pieces after duration', () => {
      const { container } = render(<Confetti isActive={true} duration={3000} pieceCount={5} />);

      expect(container.querySelectorAll('[style*="position: absolute"]').length).toBe(5);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(container.innerHTML).toBe('');
    });

    it('clears pieces when deactivated', () => {
      const { container, rerender } = render(<Confetti isActive={true} pieceCount={5} />);
      expect(container.querySelectorAll('[style*="position: absolute"]').length).toBe(5);

      rerender(<Confetti isActive={false} pieceCount={5} />);
      expect(container.innerHTML).toBe('');
    });

    it('clears timer on unmount', () => {
      const onComplete = vi.fn();
      const { unmount } = render(<Confetti isActive={true} duration={3000} onComplete={onComplete} pieceCount={5} />);
      unmount();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onComplete).not.toHaveBeenCalled();
    });

    it('uses default duration of 3000ms', () => {
      const onComplete = vi.fn();
      render(<Confetti isActive={true} onComplete={onComplete} pieceCount={5} />);

      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(onComplete).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onComplete).toHaveBeenCalledOnce();
    });
  });

  describe('CSS animations', () => {
    it('injects keyframe styles', () => {
      const { container } = render(<Confetti isActive={true} pieceCount={5} />);
      const style = container.querySelector('style');
      expect(style).not.toBeNull();
      expect(style?.textContent).toContain('confetti-fall');
      expect(style?.textContent).toContain('confetti-shake');
    });
  });
});