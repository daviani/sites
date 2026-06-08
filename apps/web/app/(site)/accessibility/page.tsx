'use client';

import { Breadcrumb } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/hooks/use-language';

export default function AccessibilityPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const currentDate = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

  return (
    <div className="min-h-screen">
      <div className="w-[var(--content-width)] mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/accessibility', label: t('nav.accessibility.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-fg">
            {t('pages.accessibility.title')}
          </h1>
          <p className="text-xl text-fg dark:text-fg-muted">
            {t('pages.accessibility.subtitle')}
          </p>
        </div>

        <div className="bg-surface-hi dark:bg-surface rounded-lg p-6 mb-8 border-l-4 border-ok">
          <p className="text-lg font-semibold text-fg dark:text-ok">
            {t('pages.accessibility.status')}
          </p>
          <p className="text-fg dark:text-fg-muted mt-2">
            {t('pages.accessibility.statusDetail')}
          </p>
        </div>

        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.accessibility.commitment')}
            </h2>
            <p className="text-fg dark:text-fg-muted">
              {t('pages.accessibility.commitmentText')}
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.accessibility.standards')}
            </h2>
            <p className="text-fg dark:text-fg-muted">
              {t('pages.accessibility.standardsText')}
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.accessibility.conformity')}
            </h2>
            <ul className="space-y-2">
              {conformityItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-fg dark:text-fg-muted">
                  <span className="text-ok mt-1">✓</span>
                  <span>{t(`pages.accessibility.conformityItems.${item}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.accessibility.testing')}
            </h2>
            <p className="text-fg dark:text-fg-muted">
              {t('pages.accessibility.testingText')}
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.accessibility.contact')}
            </h2>
            <p className="text-fg dark:text-fg-muted mb-4">
              {t('pages.accessibility.contactText')}
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-accent text-on-accent rounded-lg hover:bg-accent transition-colors"
            >
              {t('nav.contact.title')}
            </a>
          </section>

          <div className="text-sm text-fg dark:text-fg-muted text-center mt-8">
            <p>
              {t('pages.accessibility.declarationDate')}: {currentDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
