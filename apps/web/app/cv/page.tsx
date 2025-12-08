'use client';

import { useTranslation, Breadcrumb } from '@daviani/ui';
import { CvLayout, CvDownloadButton } from '@/components/cv';

export default function CvPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-5">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/cv', labelKey: 'nav.cv.title' }]} />
        </div>
        <div className="mb-6 text-center">
          <h1 className="mb-3 text-4xl font-bold text-nord0 md:text-5xl dark:text-nord6">
            {t('pages.cv.title')}
          </h1>
          <p className="mb-5 text-xl text-nord0 dark:text-nord4">
            {t('pages.cv.subtitle')}
          </p>
          <CvDownloadButton />
        </div>
        <CvLayout />
        <div className="mt-8 flex justify-center">
          <CvDownloadButton />
        </div>
      </div>
    </div>
  );
}