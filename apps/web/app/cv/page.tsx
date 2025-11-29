'use client';

import { useTranslation, Breadcrumb } from '@daviani/ui';

export default function CvPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/cv', labelKey: 'nav.cv.title' }]} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('pages.cv.title')}
          </h1>
          <p className="text-xl text-nord0 dark:text-nord4">
            {t('pages.cv.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
