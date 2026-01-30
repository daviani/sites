'use client';

import { HeroSection } from '@/components/HeroSection';
import { ExpertiseSection } from '@/components/ExpertiseSection';

export default function HomePageClient() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <HeroSection />
        <ExpertiseSection />
      </div>
    </div>
  );
}
