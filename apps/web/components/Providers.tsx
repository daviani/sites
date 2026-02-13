'use client';

import { LanguageProvider, ThemeProvider } from '@nordic-island/ui';
import { EasterEggProvider } from '@/components/EasterEggProvider';
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
