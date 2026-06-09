'use client';

import { FoxLogo } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-[22px] py-[13px] rounded-xl text-[15px] font-semibold bg-accent text-on-accent hover:brightness-110 hover:-translate-y-px transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';
const btnGhost =
  'inline-flex items-center justify-center gap-2 px-[22px] py-[13px] rounded-xl text-[15px] font-semibold border border-surface-hi/60 text-fg hover:bg-surface-el transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-10 items-center">
        {/* Texte (renard d'abord sur mobile) */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <div className="inline-flex items-center gap-[9px] font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3">
            <span aria-hidden="true" className="w-[22px] h-px bg-accent/60" />
            {t('home.eyebrow')}
          </div>

          <h1 className="text-[clamp(44px,5.4vw,68px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            {t('home.title')}
          </h1>
          <p className="text-[clamp(19px,2.1vw,24px)] font-semibold text-accent mt-2.5">
            {t('home.subtitle')}
          </p>
          <p className="text-base text-fg-muted leading-[1.7] mt-[18px] max-w-[46ch] mx-auto md:mx-0">
            {t('home.description')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 mt-[30px] justify-center md:justify-start">
            <a href="/contact" className={btnPrimary}>
              {t('home.cta.contact')}
            </a>
            <a href="/cv" className={`${btnGhost} group`}>
              {t('home.cta.cv')}
              <span
                className="text-fire transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* Renard de feu */}
        <div className="order-1 md:order-2 relative flex items-center justify-center md:-translate-y-5" aria-hidden="true">
          <div
            className="absolute w-[78%] aspect-square rounded-full blur-lg"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--tuli-accent) 22%, transparent), color-mix(in oklab, var(--tuli-accent-2) 10%, transparent) 45%, transparent 70%)',
            }}
          />
          <FoxLogo
            data-testid="hero-logo"
            className="relative w-[min(380px,90%)] aspect-square drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </section>
  );
}
