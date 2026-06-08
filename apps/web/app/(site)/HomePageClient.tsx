'use client';

import { HeroSection } from '@/components/HeroSection';
import { ExpertiseSection } from '@/components/ExpertiseSection';

export default function HomePageClient() {
  return (
    <div className="py-12">
      <div className="w-[var(--content-width)] mx-auto px-6">
        <HeroSection />
        <ExpertiseSection />
      </div>
    </div>
  );
}
