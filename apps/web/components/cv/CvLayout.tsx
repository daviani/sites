'use client';

import { CvSidebar } from './CvSidebar';
import { CvMain } from './CvMain';
import type { LocalizedCvData } from '@/lib/content/cv-keystatic';

interface CvLayoutProps {
  cvData: LocalizedCvData;
  skills: string[];
}

export function CvLayout({ cvData, skills }: CvLayoutProps) {
  return (
    <div
      className="mx-auto flex overflow-hidden rounded-xl bg-white shadow-xl dark:bg-nord-0"
      style={{
        maxWidth: '210mm',
        gap: '10px',
        padding: '10px',
      }}
    >
      <CvSidebar cvData={cvData} skills={skills} />
      <CvMain cvData={cvData} />
    </div>
  );
}