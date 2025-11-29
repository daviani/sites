'use client';

import { useTranslation, TranslationKey } from '@daviani/ui';
import { getSubdomainUrl, getBaseUrl, ValidSubdomain } from '@/lib/domains/config';

type PageLink = {
  subdomain: ValidSubdomain;
  titleKey: TranslationKey;
  descKey: TranslationKey;
};

export default function SitemapPage() {
  const { t } = useTranslation();

  const mainPages: PageLink[] = [
    { subdomain: 'portfolio', titleKey: 'nav.portfolio.title', descKey: 'nav.portfolio.description' },
    { subdomain: 'blog', titleKey: 'nav.blog.title', descKey: 'nav.blog.description' },
    { subdomain: 'cv', titleKey: 'nav.cv.title', descKey: 'nav.cv.description' },
    { subdomain: 'contact', titleKey: 'nav.contact.title', descKey: 'nav.contact.description' },
    { subdomain: 'rdv', titleKey: 'nav.rdv.title', descKey: 'nav.rdv.description' },
  ];

  const utilityPages: PageLink[] = [
    { subdomain: 'legal', titleKey: 'nav.legal.title', descKey: 'nav.legal.description' },
    { subdomain: 'accessibility', titleKey: 'nav.accessibility.title', descKey: 'nav.accessibility.description' },
    { subdomain: 'help', titleKey: 'nav.help.title', descKey: 'nav.help.description' },
    { subdomain: 'sitemap', titleKey: 'nav.sitemap.title', descKey: 'nav.sitemap.description' },
  ];

  return (
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('pages.sitemap.title')}
          </h1>
          <p className="text-xl text-nord3 dark:text-nord4">
            {t('pages.sitemap.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-nord1 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-nord10">
              {t('pages.sitemap.mainPages')}
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={getBaseUrl()}
                  className="flex items-center text-nord3 dark:text-nord4 hover:text-nord10 dark:hover:text-nord8 transition-colors"
                >
                  <span className="mr-2">→</span>
                  {t('home.title')}
                </a>
              </li>
              {mainPages.map((page) => (
                <li key={page.subdomain}>
                  <a
                    href={getSubdomainUrl(page.subdomain)}
                    className="flex items-center text-nord3 dark:text-nord4 hover:text-nord10 dark:hover:text-nord8 transition-colors"
                  >
                    <span className="mr-2">→</span>
                    {t(page.titleKey)}
                    <span className="ml-2 text-sm text-nord4 dark:text-nord3">
                      ({t(page.descKey)})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-nord1 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-nord10">
              {t('pages.sitemap.utilities')}
            </h2>
            <ul className="space-y-3">
              {utilityPages.map((page) => (
                <li key={page.subdomain}>
                  <a
                    href={getSubdomainUrl(page.subdomain)}
                    className="flex items-center text-nord3 dark:text-nord4 hover:text-nord10 dark:hover:text-nord8 transition-colors"
                  >
                    <span className="mr-2">→</span>
                    {t(page.titleKey)}
                    <span className="ml-2 text-sm text-nord4 dark:text-nord3">
                      ({t(page.descKey)})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
