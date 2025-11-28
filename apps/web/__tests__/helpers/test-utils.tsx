import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, LanguageProvider } from '@daviani/ui';
import { ReactElement, ReactNode } from 'react';

// Mock matchMedia for tests (runs when this module is imported)
const mockMatchMedia = (matches: boolean = false) => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Setup matchMedia mock
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn(() => mockMatchMedia(false)),
  });
}

// Wrapper with all required providers
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}

// Custom render function that wraps components with providers
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with our custom version
export { renderWithProviders as render };
