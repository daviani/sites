import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { LanguageProvider, ThemeProvider } from '../../src';

// Mock matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>{children}</LanguageProvider>
  </ThemeProvider>
);

export const renderWithProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: Wrapper });
};

export * from '@testing-library/react';