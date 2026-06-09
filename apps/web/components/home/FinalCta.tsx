'use client';

import { useTranslation } from '@/hooks/use-translation';

/** CTA de fin de page d'accueil → /contact. */
export function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="py-[84px] text-center border-t border-surface-hi/40">
      <h2 className="text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-0.03em] text-fg">
        {t('home.finalCta.title')}
      </h2>
      <p className="text-[17px] text-fg-muted mt-4 max-w-[46ch] mx-auto">{t('home.finalCta.text')}</p>
      <a
        href="/contact"
        className="inline-flex items-center gap-2 mt-[30px] px-7 py-[15px] rounded-xl text-base font-semibold bg-accent text-on-accent hover:brightness-110 hover:-translate-y-px transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        {t('home.finalCta.button')}
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
