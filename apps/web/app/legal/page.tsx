'use client';

import { useTranslation } from '@daviani/ui';

export default function LegalPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('pages.legal.title')}</h1>
        <p className="text-lg text-nord0 dark:text-nord4">
          {t('pages.legal.subtitle')}
        </p>
      </div>
    </div>
  );
}
