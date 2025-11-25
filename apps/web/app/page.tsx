'use client';

import { NavigationCard } from '@/components/NavigationCard';
import { useTranslation, TranslationKey } from '@daviani/ui';

interface NavItem {
  href: string;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

const navigationItems: NavItem[] = [
  {
    href: 'https://portfolio.daviani.dev',
    icon: '💼',
    titleKey: 'nav.portfolio.title',
    descriptionKey: 'nav.portfolio.description'
  },
  {
    href: 'https://blog.daviani.dev',
    icon: '📝',
    titleKey: 'nav.blog.title',
    descriptionKey: 'nav.blog.description'
  },
  {
    href: 'https://cv.daviani.dev',
    icon: '📄',
    titleKey: 'nav.cv.title',
    descriptionKey: 'nav.cv.description'
  },
  {
    href: 'https://contact.daviani.dev',
    icon: '✉️',
    titleKey: 'nav.contact.title',
    descriptionKey: 'nav.contact.description'
  },
  {
    href: 'https://rdv.daviani.dev',
    icon: '📅',
    titleKey: 'nav.rdv.title',
    descriptionKey: 'nav.rdv.description'
  },
  {
    href: 'https://legal.daviani.dev',
    icon: '⚖️',
    titleKey: 'nav.legal.title',
    descriptionKey: 'nav.legal.description'
  }
];

export default function RootPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nord-6 via-nord-5 to-nord-4 dark:from-nord-0 dark:via-nord-1 dark:to-nord-2">
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-6xl font-bold mb-6 text-nord-0 dark:text-nord-6">
          {t('home.title')}
        </h1>
        <p className="text-2xl text-nord-2 dark:text-nord-4 mb-12">
          {t('home.subtitle')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {navigationItems.map((item) => (
            <NavigationCard
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={t(item.titleKey)}
              description={t(item.descriptionKey)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
