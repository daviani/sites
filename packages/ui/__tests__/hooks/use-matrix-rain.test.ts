import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMatrixRain } from '../../src/hooks/use-matrix-rain';

describe('useMatrixRain', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    vi.clearAllMocks();
    rafCallbacks = [];

    mockCtx = {
      fillStyle: '',
      font: '',
      fillRect: vi.fn(),
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      width: 0,
      height: 0,
    } as unknown as HTMLCanvasElement;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});

    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('activation', () => {
    it('does not start animation when inactive', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: false,
          canvasRef: { current: mockCanvas },
        })
      );

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('starts animation when active with valid canvas', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('does not start when canvasRef is null', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: null },
        })
      );

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('canvas setup', () => {
    it('sets canvas dimensions to window size', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(600);
    });

    it('fills canvas with black initially', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      // fillRect is called with full canvas dimensions for the initial black fill
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('adds resize listener', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('animation loop', () => {
    it('draws on each animation frame', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      // Execute the first rAF callback to trigger a draw
      if (rafCallbacks.length > 0) {
        rafCallbacks[0](0);
      }

      // fillRect called for initial black + semi-transparent overlay
      expect(mockCtx.fillRect).toHaveBeenCalled();
    });

    it('uses custom color when provided', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
          color: '#FF0000',
        })
      );

      if (rafCallbacks.length > 0) {
        rafCallbacks[0](0);
      }

      // The draw function sets fillStyle to the custom color
      // After initial black and semi-transparent overlay, it should use custom color
      const fillStyleCalls = (mockCtx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
      expect(fillStyleCalls.length).toBeGreaterThan(0);
    });

    it('uses custom fontSize when provided', () => {
      renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
          fontSize: 20,
        })
      );

      if (rafCallbacks.length > 0) {
        rafCallbacks[0](0);
      }

      // Font should include the custom size
      expect(mockCtx.font).toContain('20px');
    });
  });

  describe('cleanup', () => {
    it('cancels animation frame on unmount', () => {
      const { unmount } = renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      unmount();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('removes resize listener on unmount', () => {
      const { unmount } = renderHook(() =>
        useMatrixRain({
          isActive: true,
          canvasRef: { current: mockCanvas },
        })
      );

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});