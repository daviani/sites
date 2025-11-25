import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../src/hooks/use-theme';

// Mock localStorage
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

// Mock matchMedia
const matchMediaMock = (matches: boolean) => ({
  matches,
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('useTheme Hook', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('returns light theme by default when no preference stored', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
    });

    it('returns mounted as false initially, then true after mount', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      const { result } = renderHook(() => useTheme());

      // After useEffect runs, mounted should be true
      expect(result.current.mounted).toBe(true);
    });

    it('uses stored theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('dark');
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('uses system preference when no stored theme', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(true)), // prefers dark
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('toggles from dark to light', () => {
      localStorageMock.getItem.mockReturnValueOnce('dark');
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('DOM Class Management', () => {
    it('adds dark class to documentElement when dark theme', () => {
      localStorageMock.getItem.mockReturnValueOnce('dark');
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from documentElement when light theme', () => {
      document.documentElement.classList.add('dark');
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn(() => matchMediaMock(false)),
      });

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
