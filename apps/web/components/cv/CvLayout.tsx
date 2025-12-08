'use client';

import { CvSidebar } from './CvSidebar';
import { CvMain } from './CvMain';

export function CvLayout() {
  return (
    <div
      className="mx-auto flex overflow-hidden rounded-xl bg-white shadow-xl dark:bg-[#2E3440]"
      style={{
        maxWidth: '210mm',
        gap: '10px',
        padding: '10px',
      }}
    >
      <CvSidebar />
      <CvMain />
    </div>
  );
}