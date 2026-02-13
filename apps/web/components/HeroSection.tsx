'use client';

import { OwlLogo } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';

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

      <p className="text-xl md:text-2xl text-nord-2 dark:text-nord-8 mb-4">
        {t('home.subtitle')}
      </p>

      <p className="text-lg text-nord-0 dark:text-nord-4 max-w-2xl mx-auto mb-8">
        {t('home.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-nord-btn text-white hover:bg-nord-btn-hover transition-colors focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2"
        >
          {t('home.cta.contact')}
        </a>
        <a
          href="/cv"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-nord-10 text-nord-10 dark:text-nord-8 hover:bg-nord-btn hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2"
        >
          {t('home.cta.cv')}
        </a>
      </div>
    </section>
  );
}
