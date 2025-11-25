import { renderHook, act } from '@testing-library/react';
import { useTranslation } from '../src/hooks/use-translation';
import { LanguageProvider } from '../src/hooks/use-language';
import { ReactNode } from 'react';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useTranslation Hook', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    Object.defineProperty(navigator, 'language', {
      value: 'fr-FR',
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Translation Function', () => {
    it('returns French translation by default', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('home.title')).toBe('Daviani Fillatre');
      expect(result.current.t('home.subtitle')).toBe('Développeur Full-Stack & DevOps');
    });

    it('returns English translation when language is en', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('home.subtitle')).toBe('Full-Stack & DevOps Developer');
    });

    it('returns nested translations', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('nav.portfolio.title')).toBe('Portfolio');
      expect(result.current.t('nav.portfolio.description')).toBe('Projets & compétences');
    });

    it('returns deeply nested translations', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('pages.portfolio.skillsList.frontend')).toBe('Next.js, React, TypeScript');
    });

    it('returns key if translation not found', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('nonexistent.key' as any)).toBe('nonexistent.key');
    });
  });

  describe('Language State', () => {
    it('exposes current language', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.language).toBe('fr');
    });

    it('exposes mounted state', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.mounted).toBe(true);
    });
  });

  describe('Dark Mode Translations', () => {
    it('returns dark mode translations in French', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('darkMode.switchToDark')).toBe('Passer en mode sombre');
      expect(result.current.t('darkMode.switchToLight')).toBe('Passer en mode clair');
    });

    it('returns dark mode translations in English', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('darkMode.switchToDark')).toBe('Switch to dark mode');
      expect(result.current.t('darkMode.switchToLight')).toBe('Switch to light mode');
    });
  });

  describe('Common Translations', () => {
    it('returns common translations', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('common.french')).toBe('Français');
      expect(result.current.t('common.english')).toBe('Anglais');
    });
  });

  describe('Navigation Translations', () => {
    it('returns all navigation items in French', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('nav.blog.title')).toBe('Blog');
      expect(result.current.t('nav.cv.title')).toBe('CV');
      expect(result.current.t('nav.contact.title')).toBe('Contact');
      expect(result.current.t('nav.rdv.title')).toBe('Rendez-vous');
      expect(result.current.t('nav.legal.title')).toBe('Légal');
    });

    it('returns all navigation items in English', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('nav.blog.title')).toBe('Blog');
      expect(result.current.t('nav.cv.title')).toBe('Resume');
      expect(result.current.t('nav.contact.title')).toBe('Contact');
      expect(result.current.t('nav.rdv.title')).toBe('Appointment');
      expect(result.current.t('nav.legal.title')).toBe('Legal');
    });
  });

  describe('Page Translations', () => {
    it('returns page titles in French', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('pages.blog.title')).toBe('Blog');
      expect(result.current.t('pages.cv.title')).toBe('Curriculum Vitae');
      expect(result.current.t('pages.contact.title')).toBe('Contact');
      expect(result.current.t('pages.rdv.title')).toBe('Prendre rendez-vous');
      expect(result.current.t('pages.legal.title')).toBe('Mentions légales');
    });

    it('returns page titles in English', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.t('pages.rdv.title')).toBe('Book an appointment');
      expect(result.current.t('pages.legal.title')).toBe('Legal notice');
    });
  });
});
