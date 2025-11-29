'use client';

import { useTranslation } from '../hooks/use-translation';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-[96px] focus:right-[30px] focus:z-[100] focus:px-4 focus:py-2 focus:bg-nord-10 focus:text-white focus:font-semibold focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-nord-8 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-nord-0 transition-colors"
    >
      {t('common.skipToContent')}
    </a>
  );
}
