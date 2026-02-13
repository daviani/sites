'use client';

import { Breadcrumb } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';

const GITHUB_REPO_URL = 'https://github.com/daviani/daviani-dev';
const LAST_UPDATE_DATE = '2025-12-05';

const THIRD_PARTY_SERVICES = [
  'vercel',
  'cloudflare',
  'recaptcha',
  'resend',
  'calendly',
  'github',
] as const;

export default function LegalPage() {
  const { t, language } = useTranslation();

  const formattedDate = new Date(LAST_UPDATE_DATE).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/legal', label: t('nav.legal.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.legal.title')}
          </h1>
          <p className="text-xl text-nord-3 dark:text-nord-4">
            {t('pages.legal.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Publisher section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.publisher.title')}
            </h2>
            <div className="text-nord-0 dark:text-nord-4 space-y-2">
              <p><strong>{t('pages.legal.publisher.name')}</strong></p>
              <p>{t('pages.legal.publisher.status')}</p>
              <p>
                <a
                  href={`mailto:${t('pages.legal.publisher.email')}`}
                  className="text-nord-10 hover:underline"
                >
                  {t('pages.legal.publisher.email')}
                </a>
              </p>
              <p>
                <a
                  href={t('pages.legal.publisher.website')}
                  className="text-nord-10 hover:underline"
                >
                  {t('pages.legal.publisher.website')}
                </a>
              </p>
            </div>
          </section>

          {/* 2. Hosting section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.hosting.title')}
            </h2>
            <div className="text-nord-0 dark:text-nord-4 space-y-2">
              <p><strong>{t('pages.legal.hosting.provider')}</strong></p>
              <p>{t('pages.legal.hosting.address')}</p>
              <p>
                <a
                  href={t('pages.legal.hosting.website')}
                  className="text-nord-10 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('pages.legal.hosting.website')}
                </a>
              </p>
            </div>
          </section>

          {/* 3. Privacy Policy section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.privacy.title')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4 mb-6">
              {t('pages.legal.privacy.intro')}
            </p>

            <div className="space-y-6">
              {/* Data collected */}
              <div>
                <h3 className="text-lg font-semibold text-nord-0 dark:text-nord-6 mb-2">
                  {t('pages.legal.privacy.dataCollected.title')}
                </h3>
                <p className="text-nord-0 dark:text-nord-4">
                  {t('pages.legal.privacy.dataCollected.text')}
                </p>
              </div>

              {/* Legal basis table */}
              <div>
                <h3 className="text-lg font-semibold text-nord-0 dark:text-nord-6 mb-3">
                  {t('pages.legal.privacy.legalBasis.title')}
                </h3>
                <p className="text-nord-0 dark:text-nord-4 mb-4">
                  {t('pages.legal.privacy.legalBasis.intro')}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-nord-0 dark:text-nord-4">
                    <thead>
                      <tr className="border-b border-nord-4 dark:border-nord-3">
                        <th className="text-left py-2 pr-4 font-semibold">
                          {t('pages.legal.thirdParty.usage')}
                        </th>
                        <th className="text-left py-2 pr-4 font-semibold">
                          {t('pages.legal.thirdParty.basis')}
                        </th>
                        <th className="text-left py-2 font-semibold">
                          {language === 'fr' ? 'Finalité' : 'Purpose'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-nord-5 dark:border-nord-2">
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.contact')}</td>
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.contactBasis')}</td>
                        <td className="py-2">{t('pages.legal.privacy.legalBasis.contactPurpose')}</td>
                      </tr>
                      <tr className="border-b border-nord-5 dark:border-nord-2">
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.appointment')}</td>
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.appointmentBasis')}</td>
                        <td className="py-2">{t('pages.legal.privacy.legalBasis.appointmentPurpose')}</td>
                      </tr>
                      <tr className="border-b border-nord-5 dark:border-nord-2">
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.comments')}</td>
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.commentsBasis')}</td>
                        <td className="py-2">{t('pages.legal.privacy.legalBasis.commentsPurpose')}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.security')}</td>
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.securityBasis')}</td>
                        <td className="py-2">{t('pages.legal.privacy.legalBasis.securityPurpose')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data retention */}
              <div>
                <h3 className="text-lg font-semibold text-nord-0 dark:text-nord-6 mb-2">
                  {t('pages.legal.privacy.retention.title')}
                </h3>
                <p className="text-nord-0 dark:text-nord-4">
                  {t('pages.legal.privacy.retention.text')}
                </p>
              </div>

              {/* GDPR Rights */}
              <div>
                <h3 className="text-lg font-semibold text-nord-0 dark:text-nord-6 mb-2">
                  {t('pages.legal.privacy.rights.title')}
                </h3>
                <p className="text-nord-0 dark:text-nord-4 mb-3">
                  {t('pages.legal.privacy.rights.text')}
                </p>
                <ul className="list-disc list-inside text-nord-0 dark:text-nord-4 space-y-1 ml-2">
                  <li>{t('pages.legal.privacy.rights.access')}</li>
                  <li>{t('pages.legal.privacy.rights.rectification')}</li>
                  <li>{t('pages.legal.privacy.rights.deletion')}</li>
                  <li>{t('pages.legal.privacy.rights.portability')}</li>
                  <li>{t('pages.legal.privacy.rights.opposition')}</li>
                </ul>
                <p className="text-nord-0 dark:text-nord-4 mt-3">
                  {t('pages.legal.privacy.rights.contact')}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Third-party services section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.thirdParty.title')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4 mb-4">
              {t('pages.legal.thirdParty.intro')}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-nord-0 dark:text-nord-4">
                <thead>
                  <tr className="border-b border-nord-4 dark:border-nord-3">
                    <th className="text-left py-2 pr-4 font-semibold">
                      {t('pages.legal.thirdParty.service')}
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold">
                      {t('pages.legal.thirdParty.usage')}
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold">
                      {t('pages.legal.thirdParty.basis')}
                    </th>
                    <th className="text-left py-2 font-semibold">
                      {t('pages.legal.thirdParty.policy')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {THIRD_PARTY_SERVICES.map((service) => (
                    <tr key={service} className="border-b border-nord-5 dark:border-nord-2 last:border-0">
                      <td className="py-2 pr-4 font-medium">
                        {t(`pages.legal.thirdParty.services.${service}.name`)}
                      </td>
                      <td className="py-2 pr-4">
                        {t(`pages.legal.thirdParty.services.${service}.usage`)}
                      </td>
                      <td className="py-2 pr-4">
                        {t(`pages.legal.thirdParty.services.${service}.basis`)}
                      </td>
                      <td className="py-2">
                        <a
                          href={t(`pages.legal.thirdParty.services.${service}.url`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-nord-10 hover:underline"
                        >
                          ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Data transfers section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.dataTransfers.title')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4">
              {t('pages.legal.dataTransfers.text')}
            </p>
          </section>

          {/* 6. Cookies section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.cookies.title')}
            </h2>
            <p className="text-nord-0 dark:text-nord-4 mb-4">
              {t('pages.legal.cookies.intro')}
            </p>

            <div className="space-y-4">
              {/* Technical cookies */}
              <div>
                <h3 className="text-lg font-semibold text-nord-0 dark:text-nord-6 mb-2">
                  {t('pages.legal.cookies.technical.title')}
                </h3>
                <p className="text-nord-0 dark:text-nord-4 mb-2">
                  {t('pages.legal.cookies.technical.text')}
                </p>
                <ul className="list-disc list-inside text-nord-0 dark:text-nord-4 space-y-1 ml-2">
                  <li>{t('pages.legal.cookies.technical.theme')}</li>
                  <li>{t('pages.legal.cookies.technical.language')}</li>
                </ul>
              </div>

              {/* Third-party cookies */}
              <div>
                <h3 className="text-lg font-semibold text-nord-0 dark:text-nord-6 mb-2">
                  {t('pages.legal.cookies.thirdParty.title')}
                </h3>
                <p className="text-nord-0 dark:text-nord-4 mb-2">
                  {t('pages.legal.cookies.thirdParty.text')}
                </p>
                <ul className="list-disc list-inside text-nord-0 dark:text-nord-4 space-y-1 ml-2">
                  <li>{t('pages.legal.cookies.thirdParty.calendly')}</li>
                  <li>{t('pages.legal.cookies.thirdParty.github')}</li>
                </ul>
              </div>

              <p className="text-nord-0 dark:text-nord-4 font-medium">
                {t('pages.legal.cookies.noTracking')}
              </p>
            </div>
          </section>

          {/* 7. Intellectual property section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.intellectual.title')}
            </h2>
            <div className="text-nord-0 dark:text-nord-4 space-y-3">
              <p>{t('pages.legal.intellectual.content')}</p>
              <p>{t('pages.legal.intellectual.code')}</p>
              <p>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-nord-10 hover:underline"
                >
                  {t('pages.legal.intellectual.github')} ↗
                </a>
              </p>
            </div>
          </section>

          {/* 8. Contact section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">
              {t('pages.legal.contact.title')}
            </h2>
            <div className="text-nord-0 dark:text-nord-4 space-y-3">
              <p>{t('pages.legal.contact.text')}</p>
              <p>
                <strong>{t('pages.legal.contact.dpo')}</strong>
              </p>
              <p className="text-sm">{t('pages.legal.contact.cnil')}</p>
            </div>
          </section>

          {/* Last update */}
          <div className="text-sm text-nord-3 dark:text-nord-4 text-center mt-8">
            <p>
              {t('pages.legal.lastUpdate')}: {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}