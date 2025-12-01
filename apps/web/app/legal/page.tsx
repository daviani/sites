'use client';

import { useTranslation, Breadcrumb } from '@daviani/ui';
import { getSubdomainUrl } from '@/lib/domains/config';

export default function LegalPage() {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/legal', labelKey: 'nav.legal.title' }]} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('pages.legal.title')}
          </h1>
          <p className="text-xl text-nord0 dark:text-nord4">
            {t('pages.legal.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Publisher section */}
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.legal.publisher.title')}
            </h2>
            <ul className="space-y-2 text-nord0 dark:text-nord4">
              <li><strong>{t('pages.legal.publisher.name')}</strong></li>
              <li>{t('pages.legal.publisher.status')}</li>
              <li>
                <a
                  href={`mailto:${t('pages.legal.publisher.email')}`}
                  className="text-nord10 hover:underline"
                >
                  {t('pages.legal.publisher.email')}
                </a>
              </li>
              <li>
                <a
                  href={t('pages.legal.publisher.website')}
                  className="text-nord10 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('pages.legal.publisher.website')}
                </a>
              </li>
            </ul>
          </section>

          {/* Hosting section */}
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.legal.hosting.title')}
            </h2>
            <ul className="space-y-2 text-nord0 dark:text-nord4">
              <li><strong>{t('pages.legal.hosting.provider')}</strong></li>
              <li>{t('pages.legal.hosting.address')}</li>
              <li>
                <a
                  href={t('pages.legal.hosting.website')}
                  className="text-nord10 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('pages.legal.hosting.website')}
                </a>
              </li>
            </ul>
          </section>

          {/* Privacy section */}
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.legal.privacy.title')}
            </h2>
            <p className="text-nord0 dark:text-nord4 mb-6">
              {t('pages.legal.privacy.intro')}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-nord0 dark:text-nord6 mb-2">
                  {t('pages.legal.privacy.dataCollected.title')}
                </h3>
                <p className="text-nord0 dark:text-nord4">
                  {t('pages.legal.privacy.dataCollected.text')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-nord0 dark:text-nord6 mb-2">
                  {t('pages.legal.privacy.purpose.title')}
                </h3>
                <p className="text-nord0 dark:text-nord4">
                  {t('pages.legal.privacy.purpose.text')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-nord0 dark:text-nord6 mb-2">
                  {t('pages.legal.privacy.retention.title')}
                </h3>
                <p className="text-nord0 dark:text-nord4">
                  {t('pages.legal.privacy.retention.text')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-nord0 dark:text-nord6 mb-2">
                  {t('pages.legal.privacy.rights.title')}
                </h3>
                <p className="text-nord0 dark:text-nord4">
                  {t('pages.legal.privacy.rights.text')}
                </p>
              </div>
            </div>
          </section>

          {/* Cookies section */}
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.legal.cookies.title')}
            </h2>
            <p className="text-nord0 dark:text-nord4 mb-4">
              {t('pages.legal.cookies.text')}
            </p>
            <p className="text-nord0 dark:text-nord4">
              {t('pages.legal.cookies.thirdParty')}
            </p>
          </section>

          {/* Intellectual property section */}
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord10">
              {t('pages.legal.intellectual.title')}
            </h2>
            <p className="text-nord0 dark:text-nord4">
              {t('pages.legal.intellectual.text')}
            </p>
          </section>

          {/* Contact link */}
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg text-center">
            <p className="text-nord0 dark:text-nord4 mb-4">
              {t('pages.legal.privacy.rights.text').split('.')[0]}.
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
              {t('pages.legal.lastUpdate')}: {currentDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
