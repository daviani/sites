'use client';

import { CvIsland } from './CvIsland';
import { CvMain } from './CvMain';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

type SkillsByCategory = Record<string, string[]>;

interface CvLayoutProps {
  cvData: LocalizedCvData;
  skillsByCategory: SkillsByCategory;
}

export function CvLayout({ cvData, skillsByCategory }: CvLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-nord-5 bg-white p-4 dark:border-nord-3 dark:bg-nord-1">
      <CvIsland cvData={cvData} skillsByCategory={skillsByCategory} />
      <div className="px-1 pt-4.5">
        <CvMain cvData={cvData} />
      </div>
    </div>
  );
}