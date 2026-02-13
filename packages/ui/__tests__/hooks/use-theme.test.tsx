import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../src/hooks/use-theme';
import type { ReactNode } from 'react';

describe('useTheme', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  beforeEach(() => {
    // Reset DOM and cookies
    document.documentElement.classList.remove('dark');
    document.cookie = 'theme=; max-age=0';

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('throws error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('provides default theme as light', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme switches between light and dark', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('setTheme changes the theme directly', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
  });

  it('adds dark class to document when theme is dark', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from document when theme is light', async () => {
    document.documentElement.classList.add('dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads stored theme from cookie on mount', async () => {
    // Simulate the blocking script having already applied .dark
    document.cookie = 'theme=dark';
    document.documentElement.classList.add('dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe('dark');
  });

  it('stores theme in cookie when changed', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.cookie).toContain('theme=dark');
  });

  it('respects system preference when no cookie is set', async () => {
    // Simulate the blocking script having detected prefers-color-scheme: dark
    // and already applied .dark to <html>
    document.documentElement.classList.add('dark');

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe('dark');
  });

  it('provides mounted state', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Initially might not be mounted
    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });
  });
});
