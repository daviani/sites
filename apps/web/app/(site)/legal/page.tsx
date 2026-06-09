import type { Metadata } from 'next';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'Mentions légales',
};

const GITHUB_REPO_URL = 'https://github.com/daviani/sites';
const LAST_UPDATE_DATE = '2026-06-09';

const THIRD_PARTY_SERVICES = [
  'vercel',
  'cloudflare',
  'recaptcha',
  'resend',
  'github',
] as const;

const CARD = 'bg-surface border border-surface-hi/55 rounded-2xl p-6 md:p-8';

export default async function LegalPage() {
  const { t, lang } = await getServerTranslations();

  const formattedDate = new Date(LAST_UPDATE_DATE).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb
          items={[{ href: '/legal', label: t('nav.legal.title') }]}
          homeLabel={t('common.home')}
          ariaLabel={t('common.breadcrumb')}
        />

        <div className="text-center pt-[54px] pb-9">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
            {t('pages.legal.eyebrow')}
          </span>
          <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            {t('pages.legal.title')}
          </h1>
          <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">
            {t('pages.legal.subtitle')}
          </p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* 1. Publisher section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.publisher.title')}
            </h2>
            <div className="text-fg-muted space-y-2">
              <p><strong className="text-fg">{t('pages.legal.publisher.name')}</strong></p>
              <p>{t('pages.legal.publisher.status')}</p>
              <p>
                <a href={`mailto:${t('pages.legal.publisher.email')}`} className="text-accent hover:underline">
                  {t('pages.legal.publisher.email')}
                </a>
              </p>
              <p>
                <a href={t('pages.legal.publisher.website')} className="text-accent hover:underline">
                  {t('pages.legal.publisher.website')}
                </a>
              </p>
            </div>
          </section>

          {/* 2. Hosting section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.hosting.title')}
            </h2>
            <div className="text-fg-muted space-y-2">
              <p><strong className="text-fg">{t('pages.legal.hosting.provider')}</strong></p>
              <p>{t('pages.legal.hosting.address')}</p>
              <p>
                <a
                  href={t('pages.legal.hosting.website')}
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('pages.legal.hosting.website')}
                </a>
              </p>
            </div>
          </section>

          {/* 3. Privacy Policy section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.privacy.title')}
            </h2>
            <p className="text-fg-muted mb-6">{t('pages.legal.privacy.intro')}</p>

            <div className="space-y-6">
              {/* Data collected */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">
                  {t('pages.legal.privacy.dataCollected.title')}
                </h3>
                <p className="text-fg-muted">{t('pages.legal.privacy.dataCollected.text')}</p>
              </div>

              {/* Legal basis table */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-3">
                  {t('pages.legal.privacy.legalBasis.title')}
                </h3>
                <p className="text-fg-muted mb-4">{t('pages.legal.privacy.legalBasis.intro')}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-fg-muted">
                    <thead>
                      <tr className="border-b border-surface-hi/55">
                        <th className="text-left py-2 pr-4 font-semibold text-fg">
                          {t('pages.legal.thirdParty.usage')}
                        </th>
                        <th className="text-left py-2 pr-4 font-semibold text-fg">
                          {t('pages.legal.thirdParty.basis')}
                        </th>
                        <th className="text-left py-2 font-semibold text-fg">
                          {lang === 'fr' ? 'Finalité' : 'Purpose'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-surface-hi/55">
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.contact')}</td>
                        <td className="py-2 pr-4">{t('pages.legal.privacy.legalBasis.contactBasis')}</td>
                        <td className="py-2">{t('pages.legal.privacy.legalBasis.contactPurpose')}</td>
                      </tr>
                      <tr className="border-b border-surface-hi/55">
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
                <h3 className="text-lg font-semibold text-fg mb-2">
                  {t('pages.legal.privacy.retention.title')}
                </h3>
                <p className="text-fg-muted">{t('pages.legal.privacy.retention.text')}</p>
              </div>

              {/* GDPR Rights */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">
                  {t('pages.legal.privacy.rights.title')}
                </h3>
                <p className="text-fg-muted mb-3">{t('pages.legal.privacy.rights.text')}</p>
                <ul className="list-disc list-inside text-fg-muted space-y-1 ml-2">
                  <li>{t('pages.legal.privacy.rights.access')}</li>
                  <li>{t('pages.legal.privacy.rights.rectification')}</li>
                  <li>{t('pages.legal.privacy.rights.deletion')}</li>
                  <li>{t('pages.legal.privacy.rights.portability')}</li>
                  <li>{t('pages.legal.privacy.rights.opposition')}</li>
                </ul>
                <p className="text-fg-muted mt-3">{t('pages.legal.privacy.rights.contact')}</p>
              </div>
            </div>
          </section>

          {/* 4. Third-party services section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.thirdParty.title')}
            </h2>
            <p className="text-fg-muted mb-4">{t('pages.legal.thirdParty.intro')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-fg-muted">
                <thead>
                  <tr className="border-b border-surface-hi/55">
                    <th className="text-left py-2 pr-4 font-semibold text-fg">
                      {t('pages.legal.thirdParty.service')}
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold text-fg">
                      {t('pages.legal.thirdParty.usage')}
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold text-fg">
                      {t('pages.legal.thirdParty.basis')}
                    </th>
                    <th className="text-left py-2 font-semibold text-fg">
                      {t('pages.legal.thirdParty.policy')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {THIRD_PARTY_SERVICES.map((service) => (
                    <tr key={service} className="border-b border-surface-hi/55 last:border-0">
                      <td className="py-2 pr-4 font-medium text-fg">
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
                          className="text-accent hover:underline"
                          aria-label={t(`pages.legal.thirdParty.services.${service}.name`)}
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
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.dataTransfers.title')}
            </h2>
            <p className="text-fg-muted">{t('pages.legal.dataTransfers.text')}</p>
          </section>

          {/* 6. Cookies section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.cookies.title')}
            </h2>
            <p className="text-fg-muted mb-4">{t('pages.legal.cookies.intro')}</p>

            <div className="space-y-4">
              {/* Technical cookies */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">
                  {t('pages.legal.cookies.technical.title')}
                </h3>
                <p className="text-fg-muted mb-2">{t('pages.legal.cookies.technical.text')}</p>
                <ul className="list-disc list-inside text-fg-muted space-y-1 ml-2">
                  <li>{t('pages.legal.cookies.technical.theme')}</li>
                  <li>{t('pages.legal.cookies.technical.language')}</li>
                </ul>
              </div>

              {/* Third-party cookies */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">
                  {t('pages.legal.cookies.thirdParty.title')}
                </h3>
                <p className="text-fg-muted mb-2">{t('pages.legal.cookies.thirdParty.text')}</p>
                <ul className="list-disc list-inside text-fg-muted space-y-1 ml-2">
                  <li>{t('pages.legal.cookies.thirdParty.github')}</li>
                </ul>
              </div>

              <p className="text-fg-muted font-medium">{t('pages.legal.cookies.noTracking')}</p>
            </div>
          </section>

          {/* 7. Intellectual property section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.intellectual.title')}
            </h2>
            <div className="text-fg-muted space-y-3">
              <p>{t('pages.legal.intellectual.content')}</p>
              <p>{t('pages.legal.intellectual.code')}</p>
              <p>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline"
                >
                  {t('pages.legal.intellectual.github')} ↗
                </a>
              </p>
            </div>
          </section>

          {/* 8. Contact section */}
          <section className={CARD}>
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('pages.legal.contact.title')}
            </h2>
            <div className="text-fg-muted space-y-3">
              <p>{t('pages.legal.contact.text')}</p>
              <p><strong className="text-fg">{t('pages.legal.contact.dpo')}</strong></p>
              <p className="text-sm">{t('pages.legal.contact.cnil')}</p>
            </div>
          </section>

          {/* Last update */}
          <div className="text-sm text-fg-muted text-center mt-8">
            <p>{t('pages.legal.lastUpdate')}: {formattedDate}</p>
          </div>
        </div>
      </div>
  );
}
