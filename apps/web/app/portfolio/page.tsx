'use client';

import { useTranslation } from '@daviani/ui';

export default function PortfolioPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-nord6 dark:bg-nord0">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('home.title')}
          </h1>
          <p className="text-xl text-nord3 dark:text-nord4 mb-2">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-nord10">
            {t('pages.portfolio.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <section className="bg-white dark:bg-nord1 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-nord10">{t('pages.portfolio.skills')}</h2>
            <ul className="space-y-2 text-nord3 dark:text-nord4">
              <li>• {t('pages.portfolio.skillsList.frontend')}</li>
              <li>• {t('pages.portfolio.skillsList.backend')}</li>
              <li>• {t('pages.portfolio.skillsList.cloud')}</li>
              <li>• {t('pages.portfolio.skillsList.devops')}</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-nord1 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-nord10">{t('pages.portfolio.projects')}</h2>
            <ul className="space-y-2 text-nord3 dark:text-nord4">
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
              href="https://blog.daviani.dev"
              className="px-6 py-3 bg-nord10 text-white rounded-lg hover:bg-nord9 transition-colors"
            >
              {t('nav.blog.title')}
            </a>
            <a
              href="https://contact.daviani.dev"
              className="px-6 py-3 bg-nord8 text-white rounded-lg hover:bg-nord7 transition-colors"
            >
              {t('nav.contact.title')}
            </a>
            <a
              href="https://cv.daviani.dev"
              className="px-6 py-3 border-2 border-nord10 text-nord10 dark:text-nord8 rounded-lg hover:bg-nord10 hover:text-white transition-colors"
            >
              {t('nav.cv.title')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
