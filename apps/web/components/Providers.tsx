'use client';

import { LanguageProvider } from '@daviani/ui';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
