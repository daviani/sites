'use client';

import { CvSidebar } from './CvSidebar';
import { CvMain } from './CvMain';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

type SkillsByCategory = Record<string, string[]>;

interface CvLayoutProps {
  cvData: LocalizedCvData;
  skillsByCategory: SkillsByCategory;
}

export function CvLayout({ cvData, skillsByCategory }: CvLayoutProps) {
  return (
    <div
      className="mx-auto flex flex-col gap-2.5 overflow-hidden rounded-xl bg-white p-2.5 shadow-xl md:flex-row md:gap-2.5 md:p-2.5 dark:bg-nord-0"
      style={{ maxWidth: '210mm' }}
    >
      <CvSidebar cvData={cvData} skillsByCategory={skillsByCategory} />
      <CvMain cvData={cvData} />
    </div>
  );
}