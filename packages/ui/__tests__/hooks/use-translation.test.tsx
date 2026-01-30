import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTranslation } from '../../src/hooks/use-translation';
import { LanguageProvider } from '../../src/hooks/use-language';
import type { ReactNode } from 'react';

// Mock getCookieDomain
vi.mock('../../src/utils/cookies', () => ({
  getCookieDomain: vi.fn(() => null),
}));

describe('useTranslation', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  beforeEach(() => {
    document.cookie = 'language=; max-age=0';
    document.documentElement.lang = 'fr';
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'fr-FR',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns t function', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(typeof result.current.t).toBe('function');
  });

  it('returns tObject function', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(typeof result.current.tObject).toBe('function');
  });

  it('returns current language', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('fr');
  });

  it('returns mounted state', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });
  });

  it('t() returns translation key as fallback for unknown keys', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    // Cast to any to test unknown key behavior
    const unknownKey = 'unknown.nested.key';
    const translation = result.current.t(unknownKey as any);

    expect(translation).toBe(unknownKey);
  });

  it('t() returns translated string for known keys', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    // Using a known translation key
    const translation = result.current.t('common.close');

    expect(typeof translation).toBe('string');
    expect(translation.length).toBeGreaterThan(0);
  });

  it('tObject() returns null for unknown paths', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    const obj = result.current.tObject('unknown.path');

    expect(obj).toBeNull();
  });

  it('changes language when LanguageProvider changes', async () => {
    document.cookie = 'language=en';

    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US',
    });

    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.language).toBe('en');
  });
});

describe('useTranslation - getNestedValue', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  beforeEach(() => {
    document.cookie = 'language=; max-age=0';
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'fr-FR',
    });
  });

  it('handles deeply nested keys', async () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    // Test with a deeply nested key that exists in the translations
    const translation = result.current.t('nav.home');

    expect(typeof translation).toBe('string');
  });
});