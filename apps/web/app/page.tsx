'use client';

import { HeroSection } from '@/components/HeroSection';

export default function RootPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <HeroSection />
      </div>
    </div>
  );
}
