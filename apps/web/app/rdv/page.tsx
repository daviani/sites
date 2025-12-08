'use client';

import {
  useTranslation,
  Breadcrumb,
  ConsentGate,
  CalendlyEmbed,
} from '@daviani/ui';
import { getSubdomainUrl } from '@/lib/domains/config';

export default function RdvPage() {
  const { t } = useTranslation();
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '';

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/rdv', labelKey: 'nav.rdv.title' }]} />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.rdv.title')}
          </h1>
          <p className="text-xl text-nord-3 dark:text-nord-4 mb-4">
            {t('pages.rdv.subtitle')}
          </p>
          <p className="text-nord-3 dark:text-nord-4">
            {t('rdv.description')}
          </p>
        </div>

        <div className="mb-8">
          <ConsentGate>
            <CalendlyEmbed url={calendlyUrl} height={700} />
          </ConsentGate>
        </div>

        <p className="text-center text-sm text-nord-3 dark:text-nord-4">
          {t('rdv.fallback')}{' '}
          <a
            href={getSubdomainUrl('contact')}
            className="text-nord-10 hover:underline"
          >
            {t('nav.contact.title')}
          </a>
        </p>
      </div>
    </div>
  );
}
