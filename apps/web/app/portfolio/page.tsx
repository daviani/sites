'use client';

import { useTranslation, Breadcrumb } from '@daviani/ui';
import { getSubdomainUrl } from '@/lib/domains/config';

export default function PortfolioPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/portfolio', labelKey: 'nav.portfolio.title' }]} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('home.title')}
          </h1>
          <p className="text-xl text-nord-0 dark:text-nord-4 mb-2">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-nord-10">
            {t('pages.portfolio.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">{t('pages.portfolio.skills')}</h2>
            <ul className="space-y-2 text-nord-0 dark:text-nord-4">
              <li>• {t('pages.portfolio.skillsList.frontend')}</li>
              <li>• {t('pages.portfolio.skillsList.backend')}</li>
              <li>• {t('pages.portfolio.skillsList.cloud')}</li>
              <li>• {t('pages.portfolio.skillsList.devops')}</li>
            </ul>
          </section>

          <section className="bg-white/40 dark:bg-nord-3/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-nord-10">{t('pages.portfolio.projects')}</h2>
            <ul className="space-y-2 text-nord-0 dark:text-nord-4">
              <li>• {t('pages.portfolio.projectsList.platform')}</li>
              <li>• {t('pages.portfolio.projectsList.iac')}</li>
              <li>• {t('pages.portfolio.projectsList.distributed')}</li>
              <li>• {t('pages.portfolio.projectsList.automation')}</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center">
          <div className="flex gap-4 justify-center">
            <a
              href={getSubdomainUrl('blog')}
              className="px-6 py-3 bg-nord-10 text-white rounded-lg hover:bg-nord-9 transition-colors cursor-pointer"
            >
              {t('nav.blog.title')}
            </a>
            <a
              href={getSubdomainUrl('contact')}
              className="px-6 py-3 bg-nord-8 text-white rounded-lg hover:bg-nord-7 transition-colors cursor-pointer"
            >
              {t('nav.contact.title')}
            </a>
            <a
              href={getSubdomainUrl('cv')}
              className="px-6 py-3 border-2 border-nord-10 text-nord-10 dark:text-nord-8 rounded-lg hover:bg-nord-10 hover:text-white transition-colors cursor-pointer"
            >
              {t('nav.cv.title')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
