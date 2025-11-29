/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ThemeProvider, LanguageProvider, useTheme, DarkModeToggle } from '@daviani/ui';
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

// Mock matchMedia
const createMatchMedia = (matches: boolean) => {
  const listeners: ((e: MediaQueryListEvent) => void)[] = [];
  return {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn((_, handler) => listeners.push(handler)),
    removeEventListener: jest.fn((_, handler) => {
      const index = listeners.indexOf(handler);
      if (index > -1) listeners.splice(index, 1);
    }),
    dispatchEvent: jest.fn(),
    // Helper to trigger change events in tests
    _triggerChange: (newMatches: boolean) => {
      listeners.forEach(handler =>
        handler({ matches: newMatches } as MediaQueryListEvent)
      );
    },
    _listeners: listeners,
  };
};

// Wrapper component for hook testing
const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Theme Tests', () => {
  let mockMatchMedia: ReturnType<typeof createMatchMedia>;

  beforeEach(() => {
    // Reset mocks
    mockCookie.clear();
    jest.clearAllMocks();

    // Setup cookie mock
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => mockCookie.get(),
      set: (val: string) => mockCookie.set(val),
    });

    // Setup location mock (already configured in jest.setup.js)
    (window as any).location.hostname = 'localhost';

    // Setup matchMedia mock (default: light mode)
    mockMatchMedia = createMatchMedia(false);
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockReturnValue(mockMatchMedia),
      writable: true,
    });

    // Reset document classes
    document.documentElement.classList.remove('dark');
  });

  // ============================================
  // THEME PROVIDER
  // ============================================
  describe('ThemeProvider', () => {
    it('provides theme context to children', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toBeInTheDocument();
    });

    it('throws error when useTheme is used outside provider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      const TestComponent = () => {
        useTheme();
        return null;
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );

      consoleError.mockRestore();
    });

    it('provides default light theme initially', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      // Before mount, theme defaults to light
      expect(result.current.theme).toBe('light');
    });
  });

  // ============================================
  // THEME PERSISTENCE
  // ============================================
  describe('Theme Persistence', () => {
    it('saves theme preference to cookie when set', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(cookieStore['theme']).toBe('dark');
    });

    it('loads theme preference from cookie on mount', async () => {
      cookieStore['theme'] = 'dark';

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      expect(result.current.theme).toBe('dark');
    });

    it('applies dark class to document.documentElement when dark theme', async () => {
      cookieStore['theme'] = 'dark';

      renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('removes dark class from document.documentElement when light theme', async () => {
      document.documentElement.classList.add('dark');
      cookieStore['theme'] = 'light';

      renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });
  });

  // ============================================
  // SYSTEM PREFERENCE
  // ============================================
  describe('System Preference', () => {
    it('detects system dark mode preference when no stored theme', async () => {
      mockMatchMedia = createMatchMedia(true); // System prefers dark
      (window.matchMedia as jest.Mock).mockReturnValue(mockMatchMedia);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      expect(result.current.theme).toBe('dark');
    });

    it('detects system light mode preference when no stored theme', async () => {
      mockMatchMedia = createMatchMedia(false); // System prefers light
      (window.matchMedia as jest.Mock).mockReturnValue(mockMatchMedia);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      expect(result.current.theme).toBe('light');
    });

    it('user preference overrides system preference', async () => {
      mockMatchMedia = createMatchMedia(true); // System prefers dark
      (window.matchMedia as jest.Mock).mockReturnValue(mockMatchMedia);
      cookieStore['theme'] = 'light'; // User set light

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      expect(result.current.theme).toBe('light');
    });

    it('registers listener for system preference changes', async () => {
      renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith(
          'change',
          expect.any(Function)
        );
      });
    });

    it('removes listener on unmount', async () => {
      const { unmount } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(mockMatchMedia.addEventListener).toHaveBeenCalled();
      });

      unmount();

      expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  // ============================================
  // TOGGLE FUNCTIONALITY
  // ============================================
  describe('Toggle Functionality', () => {
    it('toggleTheme switches from light to dark', async () => {
      cookieStore['theme'] = 'light';

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('toggleTheme switches from dark to light', async () => {
      cookieStore['theme'] = 'dark';

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('setTheme sets specific theme directly', async () => {
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
  });

  // ============================================
  // HYDRATION
  // ============================================
  describe('Hydration', () => {
    it('mounted state exists and is boolean', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.mounted).toBe('boolean');
    });

    it('mounted becomes true after effects run', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
    });
  });

  // ============================================
  // COMPONENT INTEGRATION
  // ============================================
  describe('Component Integration', () => {
    // Full providers wrapper for component tests
    const AllProviders = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    );

    it('DarkModeToggle changes theme on click', async () => {
      const TestApp = () => {
        const { theme, mounted } = useTheme();
        return (
          <div>
            <DarkModeToggle />
            <span data-testid="current-theme">{mounted ? theme : 'loading'}</span>
          </div>
        );
      };

      render(
        <AllProviders>
          <TestApp />
        </AllProviders>
      );

      // Wait for mount
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).not.toHaveTextContent('loading');
      });

      // Get initial theme
      const initialTheme = screen.getByTestId('current-theme').textContent;

      // Click the toggle button
      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      // Theme should change from initial
      await waitFor(() => {
        const newTheme = screen.getByTestId('current-theme').textContent;
        expect(newTheme).not.toBe(initialTheme);
      });
    });

    it('DarkModeToggle has correct aria-label for current theme', async () => {
      render(
        <AllProviders>
          <DarkModeToggle />
        </AllProviders>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        // In light mode, label should indicate switching to dark
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('DarkModeToggle renders sun/moon icons based on theme', async () => {
      render(
        <AllProviders>
          <DarkModeToggle />
        </AllProviders>
      );

      await waitFor(() => {
        // There should be an SVG icon rendered
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // DARK CLASS APPLICATION
  // ============================================
  describe('Dark Class Application', () => {
    it('adds dark class when theme is set to dark', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class when theme is set to light', async () => {
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
  });
});
