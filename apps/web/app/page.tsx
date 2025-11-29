'use client';

import { HeroSection } from '@/components/HeroSection';

export default function RootPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="max-w-3xl mx-auto px-6">
        <HeroSection />
      </div>
    </div>
  );
}
