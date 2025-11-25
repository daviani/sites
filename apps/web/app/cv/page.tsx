'use client';

import { useTranslation } from '@daviani/ui';

export default function CvPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('pages.cv.title')}</h1>
        <p className="text-lg text-nord3 dark:text-nord4">
          {t('pages.cv.subtitle')}
        </p>
      </div>
    </div>
  );
}
