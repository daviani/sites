'use client';

import { useTranslation } from '../hooks/use-translation';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-nord10 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-nord8 focus:ring-offset-2"
    >
      {t('common.skipToContent')}
    </a>
  );
}
