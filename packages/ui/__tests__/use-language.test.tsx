import { renderHook, act } from '@testing-library/react';
import { useLanguage, LanguageProvider } from '../src/hooks/use-language';
import { ReactNode } from 'react';

// Mock document.cookie
let cookieStore: Record<string, string> = {};

const mockCookie = {
  get: () => {
    return Object.entries(cookieStore)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  },
  set: (cookieStr: string) => {
    const [nameValue] = cookieStr.split(';');
    const [name, value] = nameValue.split('=');
    cookieStore[name.trim()] = value.trim();
  },
  clear: () => {
    cookieStore = {};
  },
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useLanguage Hook', () => {
  beforeEach(() => {
    mockCookie.clear();
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => mockCookie.get(),
      set: (val: string) => mockCookie.set(val),
    });
    // Mock window.location (already configured in jest.setup.js)
    (window as any).location.hostname = 'localhost';
    document.documentElement.lang = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Context Requirement', () => {
    it('throws error when used outside LanguageProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within a LanguageProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Initial State', () => {
    it('returns fr by default when browser language is French', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.language).toBe('fr');
    });

    it('returns en when browser language is not French', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.language).toBe('en');
    });

    it('returns mounted as true after mount', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.mounted).toBe(true);
    });

    it('uses stored language from cookie', () => {
      cookieStore['language'] = 'en';
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.language).toBe('en');
    });
  });

  describe('setLanguage', () => {
    it('changes language from fr to en', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
      expect(cookieStore['language']).toBe('en');
      expect(document.documentElement.lang).toBe('en');
    });

    it('changes language from en to fr', () => {
      cookieStore['language'] = 'en';
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLanguage('fr');
      });

      expect(result.current.language).toBe('fr');
      expect(cookieStore['language']).toBe('fr');
      expect(document.documentElement.lang).toBe('fr');
    });
  });

  describe('toggleLanguage', () => {
    it('toggles from fr to en', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.toggleLanguage();
      });

      expect(result.current.language).toBe('en');
    });

    it('toggles from en to fr', () => {
      cookieStore['language'] = 'en';
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.toggleLanguage();
      });

      expect(result.current.language).toBe('fr');
    });
  });

  describe('Document Language Attribute', () => {
    it('sets document lang attribute on init', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      renderHook(() => useLanguage(), { wrapper });

      expect(document.documentElement.lang).toBe('fr');
    });

    it('updates document lang attribute on language change', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(document.documentElement.lang).toBe('en');
    });
  });

  describe('Cookie Domain Handling', () => {
    it('uses localhost domain for *.localhost subdomains', () => {
      (window as any).location.hostname = 'portfolio.localhost';
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(cookieStore['language']).toBe('en');
    });

    it('uses root domain for production subdomains', () => {
      (window as any).location.hostname = 'portfolio.daviani.dev';
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(cookieStore['language']).toBe('en');
    });
  });
});
