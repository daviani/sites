'use client';

import { NavigationCard } from '@/components/NavigationCard';
import { HeroSection } from '@/components/HeroSection';
import { useTranslation, TranslationKey } from '@daviani/ui';
import { getSubdomainUrl, ValidSubdomain } from '@/lib/domains/config';

interface NavItem {
  subdomain: ValidSubdomain;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

const navigationItems: NavItem[] = [
  {
    subdomain: 'portfolio',
    icon: '💼',
    titleKey: 'nav.portfolio.title',
    descriptionKey: 'nav.portfolio.description'
  },
  {
    subdomain: 'blog',
    icon: '📝',
    titleKey: 'nav.blog.title',
    descriptionKey: 'nav.blog.description'
  },
  {
    subdomain: 'cv',
    icon: '📄',
    titleKey: 'nav.cv.title',
    descriptionKey: 'nav.cv.description'
  },
  {
    subdomain: 'contact',
    icon: '✉️',
    titleKey: 'nav.contact.title',
    descriptionKey: 'nav.contact.description'
  },
  {
    subdomain: 'rdv',
    icon: '📅',
    titleKey: 'nav.rdv.title',
    descriptionKey: 'nav.rdv.description'
  },
  {
    subdomain: 'legal',
    icon: '⚖️',
    titleKey: 'nav.legal.title',
    descriptionKey: 'nav.legal.description'
  }
];

export default function RootPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nord-6 via-nord-5 to-nord-4 dark:from-nord-0 dark:via-nord-1 dark:to-nord-2">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <HeroSection />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {navigationItems.map((item) => (
            <NavigationCard
              key={item.subdomain}
              href={getSubdomainUrl(item.subdomain)}
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
