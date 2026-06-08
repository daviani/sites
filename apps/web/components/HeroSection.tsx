'use client';

import { useTheme } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';

export function HeroSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const logoSrc =
    theme === 'dark'
      ? '/brand/tulikettu-full-ondark-512.png'
      : '/brand/tulikettu-full-onlight-512.png';

  return (
    <section className="text-center mb-12">
      <div className="flex justify-center mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={512}
          height={512}
          data-testid="hero-logo"
          suppressHydrationWarning
        />
      </div>

      <h1 className="text-5xl md:text-6xl font-bold mb-4 text-fg">
        {t('home.title')}
      </h1>

      <p className="text-xl md:text-2xl text-accent mb-4">
        {t('home.subtitle')}
      </p>

      <p className="text-lg text-fg-muted max-w-2xl mx-auto mb-8">
        {t('home.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-accent text-on-accent hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          {t('home.cta.contact')}
        </a>
        <a
          href="/cv"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-on-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          {t('home.cta.cv')}
        </a>
      </div>
    </section>
  );
}
