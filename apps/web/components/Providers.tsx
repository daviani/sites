'use client';

import { LanguageProvider, ThemeProvider, EasterEggProvider } from '@daviani/ui';
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
