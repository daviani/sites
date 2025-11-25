import { renderHook, act } from '@testing-library/react';
import { useLanguage, LanguageProvider } from '../src/hooks/use-language';
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

describe('useLanguage Hook', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
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

    it('uses stored language from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');
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
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'en');
      expect(document.documentElement.lang).toBe('en');
    });

    it('changes language from en to fr', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLanguage('fr');
      });

      expect(result.current.language).toBe('fr');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'fr');
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
      localStorageMock.getItem.mockReturnValueOnce('en');
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
});
