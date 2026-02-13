'use client';

import { useTranslation, useLanguage, Breadcrumb } from '@nordic-island/ui';

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
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/accessibility', labelKey: 'nav.accessibility.title' }]} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.accessibility.title')}
          </h1>
          <p className="text-xl text-nord-0 dark:text-nord-4">
            {t('pages.accessibility.subtitle')}
          </p>
        </div>

        <div className="bg-nord-5 dark:bg-nord-1 rounded-lg p-6 mb-8 border-l-4 border-nord-14">
          <p className="text-lg font-semibold text-nord-0 dark:text-nord-14">
            {t('pages.accessibility.status')}
          </p>
          <p className="text-nord-0 dark:text-nord-4 mt-2">
            {t('pages.accessibility.statusDetail')}
          </p>
        </div>

        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.accessibility.commitment')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4">
              {t('pages.accessibility.commitmentText')}
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.accessibility.standards')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4">
              {t('pages.accessibility.standardsText')}
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.accessibility.conformity')}
            </h2>
            <ul className="space-y-2">
              {conformityItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-nord-0 dark:text-nord-4">
                  <span className="text-nord-14 mt-1">✓</span>
                  <span>{t(`pages.accessibility.conformityItems.${item}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.accessibility.testing')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4">
              {t('pages.accessibility.testingText')}
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.accessibility.contact')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4 mb-4">
              {t('pages.accessibility.contactText')}
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-nord-btn text-white rounded-lg hover:bg-nord-btn-hover transition-colors"
            >
              {t('nav.contact.title')}
            </a>
          </section>

          <div className="text-sm text-nord-0 dark:text-nord-4 text-center mt-8">
            <p>
              {t('pages.accessibility.declarationDate')}: {currentDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
