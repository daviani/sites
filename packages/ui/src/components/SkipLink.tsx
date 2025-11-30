'use client';

import { useTranslation } from '../hooks/use-translation';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-[140px] focus:right-[20px] focus:z-[100] focus:px-4 focus:py-3 focus:bg-nord-10/90 dark:focus:bg-nord-10/90 focus:backdrop-blur-sm focus:text-white focus:font-semibold focus:rounded-full focus:cursor-pointer focus:shadow-[0_0_20px_rgba(94,129,172,0.5)] dark:focus:shadow-[0_0_25px_rgba(136,192,208,0.4)] hover:bg-nord-10 dark:hover:bg-nord-10 hover:shadow-[0_0_30px_rgba(94,129,172,0.7)] dark:hover:shadow-[0_0_35px_rgba(136,192,208,0.6)] hover:scale-110 focus:outline-none transition-all duration-300 ease-out"
    >
      {t('common.skipToContent')}
    </a>
  );
}
