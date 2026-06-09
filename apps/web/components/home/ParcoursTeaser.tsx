'use client';

import { FoxLogo } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';

/** Teaser « Du métal au code » → renvoie vers /about. Accent chaud sur le mot-clé. */
export function ParcoursTeaser() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-[60px]">
      <div
        className="grid md:grid-cols-[1.3fr_0.7fr] rounded-3xl overflow-hidden border border-surface-hi/55"
        style={{
          background:
            'radial-gradient(60% 120% at 100% 0%, color-mix(in oklab, var(--tuli-fire) 10%, transparent), transparent 60%), linear-gradient(180deg, var(--tuli-surface), var(--tuli-bg))',
        }}
      >
        <div className="p-10 md:p-12">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-fire mb-4">
            {t('home.parcours.kicker')}
          </div>
          <h2 className="text-[clamp(26px,3.2vw,38px)] font-bold tracking-[-0.025em] text-fg leading-[1.1]">
            {t('home.parcours.titleBefore')}
            <span className="text-fire">{t('home.parcours.titleFire')}</span>
            {t('home.parcours.titleAfter')}
          </h2>
          <p className="text-base text-fg-muted leading-[1.75] mt-[18px] max-w-[52ch]">
            {t('home.parcours.text')}
          </p>
          <div className="mt-[26px]">
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:opacity-80 transition-opacity"
            >
              {t('home.parcours.link')}
              <span className="text-fire" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div
          className="hidden md:flex items-center justify-center p-8 border-l border-surface-hi/40"
          aria-hidden="true"
        >
          <FoxLogo className="w-[min(180px,70%)] aspect-square opacity-90 drop-shadow-[0_16px_40px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </section>
  );
}
