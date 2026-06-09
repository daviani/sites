import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';
import type { TranslationKey } from '@/hooks/use-translation';

export const metadata: Metadata = {
  title: 'Plan du site',
};

type PageLink = {
  href: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
};

const CARD = 'bg-surface border border-surface-hi/55 rounded-2xl p-6 md:p-8';
const LINK =
  'group inline-flex items-center text-fg-muted hover:text-accent transition-colors';

const mainPages: PageLink[] = [
  { href: '/about', titleKey: 'nav.about.title', descKey: 'nav.about.description' },
  { href: '/projets', titleKey: 'nav.projects.title', descKey: 'nav.projects.description' },
  { href: '/blog', titleKey: 'nav.blog.title', descKey: 'nav.blog.description' },
  { href: '/photos', titleKey: 'nav.photos.title', descKey: 'nav.photos.description' },
  { href: '/cv', titleKey: 'nav.cv.title', descKey: 'nav.cv.description' },
  { href: '/contact', titleKey: 'nav.contact.title', descKey: 'nav.contact.description' },
];

const utilityPages: PageLink[] = [
  { href: '/legal', titleKey: 'nav.legal.title', descKey: 'nav.legal.description' },
  { href: '/accessibility', titleKey: 'nav.accessibility.title', descKey: 'nav.accessibility.description' },
  { href: '/help', titleKey: 'nav.help.title', descKey: 'nav.help.description' },
  { href: '/plan-du-site', titleKey: 'nav.sitemap.title', descKey: 'nav.sitemap.description' },
];

export default async function SitemapPage() {
  const { t } = await getServerTranslations();

  return (
    <div>
      <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb
          items={[{ href: '/plan-du-site', label: t('nav.sitemap.title') }]}
          homeLabel={t('common.home')}
          ariaLabel={t('common.breadcrumb')}
        />

        <div className="text-center pt-[54px] pb-9">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
            {t('pages.sitemap.eyebrow')}
          </span>
          <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            {t('pages.sitemap.title')}
          </h1>
          <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">
            {t('pages.sitemap.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <section className={CARD}>
            <h2 className="text-xl font-bold mb-5 text-accent">{t('pages.sitemap.mainPages')}</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/" className={LINK}>
                  <span className="mr-2 text-fire">→</span>
                  {t('home.title')}
                </Link>
              </li>
              {mainPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className={LINK}>
                    <span className="mr-2 text-fire">→</span>
                    {t(page.titleKey)}
                    <span className="ml-2 text-sm text-fg-subtle">({t(page.descKey)})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={CARD}>
            <h2 className="text-xl font-bold mb-5 text-accent">{t('pages.sitemap.utilities')}</h2>
            <ul className="space-y-3">
              {utilityPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className={LINK}>
                    <span className="mr-2 text-fire">→</span>
                    {t(page.titleKey)}
                    <span className="ml-2 text-sm text-fg-subtle">({t(page.descKey)})</span>
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
