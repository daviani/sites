'use client';

import { ThemeProvider } from '@tulikettu/ui';
import { LanguageProvider } from '@/hooks/use-language';
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
