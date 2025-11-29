'use client';

import { useTranslation } from '@daviani/ui';
import { getSubdomainUrl } from '@/lib/domains/config';

export default function AccessibilityPage() {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('pages.accessibility.title')}
          </h1>
          <p className="text-xl text-nord0 dark:text-nord4">
            {t('pages.accessibility.subtitle')}
          </p>
        </div>

        <div className="bg-nord5 dark:bg-nord1 rounded-lg p-6 mb-8 border-l-4 border-nord10">
          <p className="text-lg font-semibold text-nord10">
            {t('pages.accessibility.status')}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.accessibility.commitment')}
            </h2>
            <p className="text-nord0 dark:text-nord4">
              {t('pages.accessibility.commitmentText')}
            </p>
          </section>

          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.accessibility.standards')}
            </h2>
            <p className="text-nord0 dark:text-nord4">
              {t('pages.accessibility.standardsText')}
            </p>
          </section>

          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.accessibility.contact')}
            </h2>
            <p className="text-nord0 dark:text-nord4 mb-4">
              {t('pages.accessibility.contactText')}
            </p>
            <a
              href={getSubdomainUrl('contact')}
              className="inline-block px-6 py-3 bg-nord10 text-white rounded-lg hover:bg-nord9 transition-colors"
            >
              {t('nav.contact.title')}
            </a>
          </section>

          <div className="text-sm text-nord0 dark:text-nord4 text-center mt-8">
            <p>
              {t('pages.accessibility.declarationDate')}: {currentDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
