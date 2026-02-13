'use client';

import Link from 'next/link';
import { Breadcrumb } from '@nordic-island/ui';
import { useTranslation, type TranslationKey } from '@/hooks/use-translation';

type PageLink = {
  href: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
};

export default function SitemapPage() {
  const { t } = useTranslation();

  const mainPages: PageLink[] = [
    { href: '/about', titleKey: 'nav.about.title', descKey: 'nav.about.description' },
    { href: '/blog', titleKey: 'nav.blog.title', descKey: 'nav.blog.description' },
    { href: '/cv', titleKey: 'nav.cv.title', descKey: 'nav.cv.description' },
    { href: '/contact', titleKey: 'nav.contact.title', descKey: 'nav.contact.description' },
    { href: '/rdv', titleKey: 'nav.rdv.title', descKey: 'nav.rdv.description' },
  ];

  const utilityPages: PageLink[] = [
    { href: '/legal', titleKey: 'nav.legal.title', descKey: 'nav.legal.description' },
    { href: '/accessibility', titleKey: 'nav.accessibility.title', descKey: 'nav.accessibility.description' },
    { href: '/help', titleKey: 'nav.help.title', descKey: 'nav.help.description' },
    { href: '/sitemap', titleKey: 'nav.sitemap.title', descKey: 'nav.sitemap.description' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/sitemap', label: t('nav.sitemap.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.sitemap.title')}
          </h1>
          <p className="text-xl text-nord-0 dark:text-nord-4">
            {t('pages.sitemap.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-nord-10">
              {t('pages.sitemap.mainPages')}
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="flex items-center text-nord-0 dark:text-nord-4 hover:text-nord-10 dark:hover:text-nord-8 transition-colors"
                >
                  <span className="mr-2">→</span>
                  {t('home.title')}
                </Link>
              </li>
              {mainPages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="flex items-center text-nord-0 dark:text-nord-4 hover:text-nord-10 dark:hover:text-nord-8 transition-colors"
                  >
                    <span className="mr-2">→</span>
                    {t(page.titleKey)}
                    <span className="ml-2 text-sm text-nord-3 dark:text-nord-3">
                      ({t(page.descKey)})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-nord-10">
              {t('pages.sitemap.utilities')}
            </h2>
            <ul className="space-y-3">
              {utilityPages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="flex items-center text-nord-0 dark:text-nord-4 hover:text-nord-10 dark:hover:text-nord-8 transition-colors"
                  >
                    <span className="mr-2">→</span>
                    {t(page.titleKey)}
                    <span className="ml-2 text-sm text-nord-3 dark:text-nord-3">
                      ({t(page.descKey)})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
