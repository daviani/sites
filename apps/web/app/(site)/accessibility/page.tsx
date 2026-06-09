import type { Metadata } from 'next';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'Accessibilité',
};

// Date de la déclaration d'accessibilité (figée — pas la date du jour).
const DECLARATION_DATE = '2026-06-09';
const CARD = 'bg-surface border border-surface-hi/55 rounded-2xl p-6 md:p-8';

const conformityItems = [
  'semantics',
  'contrast',
  'forms',
  'keyboard',
  'focus',
  'motion',
  'lang',
  'touch',
  'skiplink',
] as const;

export default async function AccessibilityPage() {
  const { t, lang } = await getServerTranslations();
  const formattedDate = new Date(DECLARATION_DATE).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div>
      <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb
          items={[{ href: '/accessibility', label: t('nav.accessibility.title') }]}
          homeLabel={t('common.home')}
          ariaLabel={t('common.breadcrumb')}
        />

        <div className="text-center pt-[54px] pb-9">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
            {t('pages.accessibility.eyebrow')}
          </span>
          <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            {t('pages.accessibility.title')}
          </h1>
          <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">
            {t('pages.accessibility.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Statut de conformité */}
          <div className="bg-surface border border-surface-hi/55 border-l-[3px] border-l-ok rounded-2xl p-6 mb-6">
            <p className="text-lg font-semibold text-ok">{t('pages.accessibility.status')}</p>
            <p className="text-fg-muted mt-2">{t('pages.accessibility.statusDetail')}</p>
          </div>

          <div className="space-y-5">
            <section className={CARD}>
              <h2 className="text-xl font-bold mb-3 text-accent">{t('pages.accessibility.commitment')}</h2>
              <p className="text-fg-muted">{t('pages.accessibility.commitmentText')}</p>
            </section>

            <section className={CARD}>
              <h2 className="text-xl font-bold mb-3 text-accent">{t('pages.accessibility.standards')}</h2>
              <p className="text-fg-muted">{t('pages.accessibility.standardsText')}</p>
            </section>

            <section className={CARD}>
              <h2 className="text-xl font-bold mb-4 text-accent">{t('pages.accessibility.conformity')}</h2>
              <ul className="space-y-2">
                {conformityItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fg-muted">
                    <span className="text-ok mt-1" aria-hidden="true">✓</span>
                    <span>{t(`pages.accessibility.conformityItems.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={CARD}>
              <h2 className="text-xl font-bold mb-3 text-accent">{t('pages.accessibility.testing')}</h2>
              <p className="text-fg-muted">{t('pages.accessibility.testingText')}</p>
            </section>

            <section className={CARD}>
              <h2 className="text-xl font-bold mb-3 text-accent">{t('pages.accessibility.contact')}</h2>
              <p className="text-fg-muted mb-4">{t('pages.accessibility.contactText')}</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-on-accent font-semibold hover:opacity-90 transition-opacity"
              >
                {t('nav.contact.title')}
                <span aria-hidden="true">→</span>
              </a>
            </section>

            <div className="text-sm text-fg-muted text-center mt-8">
              <p>{t('pages.accessibility.declarationDate')}: {formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
