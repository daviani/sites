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
      className="mx-auto flex overflow-hidden rounded-xl bg-white shadow-xl dark:bg-nord-0"
      style={{
        maxWidth: '210mm',
        gap: '10px',
        padding: '10px',
      }}
    >
      <CvSidebar cvData={cvData} skillsByCategory={skillsByCategory} />
      <CvMain cvData={cvData} />
    </div>
  );
}