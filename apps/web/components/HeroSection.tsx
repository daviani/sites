'use client';

import { useTranslation } from '@daviani/ui';
import { OwlLogo } from '@daviani/ui';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <OwlLogo size={120} />
      </div>

      <h1 className="text-5xl md:text-6xl font-bold mb-4 text-nord-0 dark:text-nord-6">
        {t('home.title')}
      </h1>

      <p className="text-xl md:text-2xl text-nord-10 dark:text-nord-8 mb-4">
        {t('home.subtitle')}
      </p>

      <p className="text-lg text-nord-3 dark:text-nord-4 max-w-2xl mx-auto">
        {t('home.description')}
      </p>
    </section>
  );
}
