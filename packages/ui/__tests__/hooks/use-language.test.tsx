import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../src/hooks/use-language';
import type { ReactNode } from 'react';

// Mock getCookieDomain
vi.mock('../../src/utils/cookies', () => ({
  getCookieDomain: vi.fn(() => null),
}));

describe('useLanguage', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  beforeEach(() => {
    // Reset cookies
    document.cookie = 'language=; max-age=0';
    document.documentElement.lang = 'fr';

    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'fr-FR',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('throws error when used outside LanguageProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow('useLanguage must be used within a LanguageProvider');

    consoleSpy.mockRestore();
  });

  it('provides default language as fr', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('fr');
  });

  it('toggleLanguage switches between fr and en', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('fr');

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe('en');

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe('fr');
  });

  it('setLanguage changes the language directly', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');

    act(() => {
      result.current.setLanguage('fr');
    });

    expect(result.current.language).toBe('fr');
  });

  it('updates document lang attribute when language changes', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(document.documentElement.lang).toBe('en');
  });

  it('reads stored language from cookie on mount', async () => {
    document.cookie = 'language=en';

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('en');
  });

  it('stores language in cookie when changed', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(document.cookie).toContain('language=en');
  });

  it('uses browser language when no cookie is set', async () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US',
    });

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('en');
  });

  it('defaults to en when browser language is not fr', async () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'de-DE',
    });

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('en');
  });

  it('provides mounted state', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });
  });
});