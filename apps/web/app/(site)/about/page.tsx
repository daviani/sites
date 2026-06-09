import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'À propos',
};

const FACTS = ['location', 'since', 'field'] as const;

export default async function AboutPage() {
  const { t } = await getServerTranslations();

  return (
    <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumb
        items={[{ href: '/about', label: t('nav.about.title') }]}
        homeLabel={t('common.home')}
        ariaLabel={t('common.breadcrumb')}
      />

      {/* En-tête centré (cohérent avec les autres pages) */}
      <div className="text-center pt-[54px] pb-9">
        <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
          {t('pages.about.eyebrow')}
        </span>
        <h1 className="text-[clamp(42px,5.4vw,64px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
          {t('pages.about.title')}
        </h1>
        <p className="max-w-[60ch] mx-auto text-[19px] leading-[1.7] text-fg mt-[22px]">
          {t('pages.about.lead.start')}
          <span className="text-fire font-semibold">{t('pages.about.lead.fire')}</span>
          {t('pages.about.lead.end')}
        </p>
      </div>

      {/* Corps narratif : bloc centré, texte aligné à gauche pour la lecture */}
      <div className="max-w-[65ch] mx-auto pb-16">
        {/* Prose narrative */}
        <article>
          <AboutSection title={t('pages.about.crossroad.title')}>
            <P>{t('pages.about.crossroad.p1')}</P>
            <P>{t('pages.about.crossroad.p2')}</P>
            <P>{t('pages.about.crossroad.p3')}</P>
          </AboutSection>

          <AboutSection title={t('pages.about.building.title')}>
            <P>{t('pages.about.building.p1')}</P>
            <P>{t('pages.about.building.p2')}</P>
            <P>{t('pages.about.building.p3')}</P>
            <P>{t('pages.about.building.p4')}</P>
          </AboutSection>

          <AboutSection title={t('pages.about.transmit.title')}>
            <P>{t('pages.about.transmit.p1')}</P>
            <P>{t('pages.about.transmit.p2')}</P>
          </AboutSection>

          <AboutSection title={t('pages.about.breathe.title')}>
            <P>{t('pages.about.breathe.p1')}</P>
            <P>
              {t('pages.about.breathe.p2Start')}
              <a
                href="/photos"
                className="text-accent font-semibold border-b border-[color-mix(in_oklab,var(--tuli-accent)_40%,transparent)] hover:opacity-80 transition-opacity"
              >
                {t('pages.about.breathe.p2Link')}
              </a>
              {t('pages.about.breathe.p2End')}
            </P>
          </AboutSection>
        </article>

        {/* Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {FACTS.map((f) => (
            <div key={f} className="rounded-2xl bg-surface border border-surface-hi/55 px-6 py-[22px]">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle mb-2">
                {t(`pages.about.facts.${f}.k`)}
              </div>
              <div className="text-[17px] font-semibold text-fg">
                {t(`pages.about.facts.${f}.v`)}
                <small className="block font-normal text-[13px] text-fg-muted mt-[3px]">
                  {t(`pages.about.facts.${f}.sub`)}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — La suite */}
        <div className="mt-[52px] pt-[34px] border-t border-surface-hi/40">
          <h3 className="text-2xl font-bold tracking-[-0.02em] text-fg">{t('pages.about.next.title')}</h3>
          <p className="text-fg-muted mt-2.5 mb-5">{t('pages.about.next.p1')}</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-xl text-[15px] font-semibold bg-accent text-on-accent hover:brightness-110 hover:-translate-y-px transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            {t('pages.about.cta.contact')}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function AboutSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-[26px] font-bold tracking-[-0.02em] text-fg mb-4">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[16.5px] leading-[1.8] text-fg-muted mb-[18px]">{children}</p>;
}
