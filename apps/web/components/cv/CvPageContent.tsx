'use client';

import { Breadcrumb } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';
import { CvLayout } from './CvLayout';
import { CvDownloadButton } from './CvDownloadButton';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

type SkillsByCategory = Record<string, string[]>;

interface CvPageContentProps {
  cvDataFr: LocalizedCvData;
  cvDataEn: LocalizedCvData;
  skillsByCategory: SkillsByCategory;
}

export function CvPageContent({ cvDataFr, cvDataEn, skillsByCategory }: CvPageContentProps) {
  const { t, language } = useTranslation();

  // Select data based on current language
  const cvData = language === 'en' ? cvDataEn : cvDataFr;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-5">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/cv', label: t('nav.cv.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>
        <div className="mb-6 text-center">
          <h1 className="mb-3 text-4xl font-bold text-nord-0 md:text-5xl dark:text-nord-6">
            {t('pages.cv.title')}
          </h1>
          <p className="mb-5 text-xl text-nord-0 dark:text-nord-4">
            {t('pages.cv.subtitle')}
          </p>
          <CvDownloadButton />
        </div>
        <CvLayout cvData={cvData} skillsByCategory={skillsByCategory} />
        <div className="mt-8 flex justify-center">
          <CvDownloadButton />
        </div>
      </div>
    </div>
  );
}