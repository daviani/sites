'use client';

import { LanguageProvider, ThemeProvider, EasterEggProvider } from '@nordic-island/ui';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <EasterEggProvider>{children}</EasterEggProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
