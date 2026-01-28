import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: mockGet,
    set: vi.fn(),
  })),
}));

import { getLanguage, getTranslation, getServerTranslations } from '@/lib/i18n/server';

describe('i18n/server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLanguage', () => {
    it('returns fr when language cookie is fr', async () => {
      mockGet.mockReturnValue({ value: 'fr' });
      expect(await getLanguage()).toBe('fr');
    });

    it('returns en when language cookie is en', async () => {
      mockGet.mockReturnValue({ value: 'en' });
      expect(await getLanguage()).toBe('en');
    });

    it('defaults to fr when no language cookie exists', async () => {
      mockGet.mockReturnValue(undefined);
      expect(await getLanguage()).toBe('fr');
    });

    it('defaults to fr when cookie value is invalid', async () => {
      mockGet.mockReturnValue({ value: 'de' });
      expect(await getLanguage()).toBe('fr');
    });
  });

  describe('getTranslation', () => {
    it('returns French translation for a known key', () => {
      const result = getTranslation('fr', 'common.home');
      expect(result).toBe('Accueil');
    });

    it('returns English translation for a known key', () => {
      const result = getTranslation('en', 'common.home');
      expect(result).toBe('Home');
    });

    it('returns the key itself for unknown key path', () => {
      const result = getTranslation('fr', 'unknown.key.path');
      expect(result).toBe('unknown.key.path');
    });

    it('returns the key when intermediate path does not exist', () => {
      const result = getTranslation('fr', 'nonexistent.deep.key');
      expect(result).toBe('nonexistent.deep.key');
    });

    it('returns the key when value is not a string', () => {
      // 'common' is an object, not a string
      const result = getTranslation('fr', 'common');
      expect(result).toBe('common');
    });
  });

  describe('getServerTranslations', () => {
    it('returns lang and t function', async () => {
      mockGet.mockReturnValue({ value: 'fr' });
      const { lang, t } = await getServerTranslations();
      expect(lang).toBe('fr');
      expect(typeof t).toBe('function');
    });

    it('t function translates known keys', async () => {
      mockGet.mockReturnValue({ value: 'fr' });
      const { t } = await getServerTranslations();
      expect(t('common.home')).toBe('Accueil');
    });

    it('t function returns key for unknown keys', async () => {
      mockGet.mockReturnValue({ value: 'fr' });
      const { t } = await getServerTranslations();
      expect(t('unknown.key')).toBe('unknown.key');
    });

    it('t function replaces parameters', async () => {
      mockGet.mockReturnValue({ value: 'fr' });
      const { t } = await getServerTranslations();
      const result = t('footer.copyright', { year: 2025 });
      expect(result).toContain('2025');
    });
  });
});
