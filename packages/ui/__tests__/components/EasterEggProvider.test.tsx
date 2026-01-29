import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import { EasterEggProvider, useEasterEggs } from '../../src/components/EasterEggProvider';
import { ReactNode } from 'react';

// Mock dependencies
vi.mock('../../src/hooks/use-konami-code', () => ({
  useKonamiCode: vi.fn(),
}));

vi.mock('../../src/hooks/use-console-message', () => ({
  useConsoleMessage: vi.fn(),
}));

vi.mock('../../src/components/Confetti', () => ({
  Confetti: ({ isActive }: { isActive: boolean }) => (
    isActive ? <div data-testid="confetti">Confetti</div> : null
  ),
}));

vi.mock('../../src/components/MatrixRain', () => ({
  MatrixRain: ({ isActive }: { isActive: boolean }) => (
    isActive ? <div data-testid="matrix">Matrix</div> : null
  ),
}));

describe('EasterEggProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders children', () => {
      render(
        <EasterEggProvider>
          <div data-testid="child">Hello</div>
        </EasterEggProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('does not render confetti or matrix by default', () => {
      render(
        <EasterEggProvider>
          <div>Content</div>
        </EasterEggProvider>
      );
      expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
      expect(screen.queryByTestId('matrix')).not.toBeInTheDocument();
    });
  });

  describe('useEasterEggs hook', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <EasterEggProvider>{children}</EasterEggProvider>
    );

    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useEasterEggs());
      }).toThrow('useEasterEggs must be used within an EasterEggProvider');
    });

    it('provides isConfettiActive state', () => {
      const { result } = renderHook(() => useEasterEggs(), { wrapper });
      expect(result.current.isConfettiActive).toBe(false);
    });

    it('provides isMatrixActive state', () => {
      const { result } = renderHook(() => useEasterEggs(), { wrapper });
      expect(result.current.isMatrixActive).toBe(false);
    });

    it('provides triggerConfetti function', () => {
      const { result } = renderHook(() => useEasterEggs(), { wrapper });
      expect(typeof result.current.triggerConfetti).toBe('function');
    });

    it('provides triggerMatrix function', () => {
      const { result } = renderHook(() => useEasterEggs(), { wrapper });
      expect(typeof result.current.triggerMatrix).toBe('function');
    });
  });

  describe('confetti effect', () => {
    const TestComponent = () => {
      const { triggerConfetti, isConfettiActive } = useEasterEggs();
      return (
        <div>
          <button onClick={triggerConfetti}>Trigger</button>
          <span data-testid="status">{isConfettiActive ? 'active' : 'inactive'}</span>
        </div>
      );
    };

    it('can trigger confetti', () => {
      render(
        <EasterEggProvider>
          <TestComponent />
        </EasterEggProvider>
      );

      const button = screen.getByText('Trigger');
      act(() => {
        button.click();
      });

      expect(screen.getByTestId('confetti')).toBeInTheDocument();
    });
  });

  describe('matrix effect', () => {
    const TestComponent = () => {
      const { triggerMatrix, isMatrixActive } = useEasterEggs();
      return (
        <div>
          <button onClick={triggerMatrix}>Trigger Matrix</button>
          <span data-testid="status">{isMatrixActive ? 'active' : 'inactive'}</span>
        </div>
      );
    };

    it('can trigger matrix', () => {
      render(
        <EasterEggProvider>
          <TestComponent />
        </EasterEggProvider>
      );

      const button = screen.getByText('Trigger Matrix');
      act(() => {
        button.click();
      });

      expect(screen.getByTestId('matrix')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('does not setup hooks when disabled', async () => {
      const { useKonamiCode } = await import('../../src/hooks/use-konami-code');
      const { useConsoleMessage } = await import('../../src/hooks/use-console-message');

      render(
        <EasterEggProvider enabled={false}>
          <div>Content</div>
        </EasterEggProvider>
      );

      // Hooks should still be called but with enabled: false
      expect(useKonamiCode).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false })
      );
      expect(useConsoleMessage).toHaveBeenCalledWith({ enabled: false });
    });
  });
});