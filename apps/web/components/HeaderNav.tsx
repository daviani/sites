'use client';

import { usePathname } from 'next/navigation';
import { Header, DarkModeToggle, LanguageSwitcher } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/hooks/use-language';

const navKeys = [
  { href: '/about', key: 'nav.about.title' as const },
  { href: '/blog', key: 'nav.blog.title' as const },
  { href: '/cv', key: 'nav.cv.title' as const },
  { href: '/contact', key: 'nav.contact.title' as const },
  { href: '/rdv', key: 'nav.rdv.title' as const },
];

const secondaryNavKeys = [
  { href: '/accessibility', key: 'nav.accessibility.title' as const },
  { href: '/sitemap', key: 'nav.sitemap.title' as const },
  { href: '/help', key: 'nav.help.title' as const },
];

export function HeaderNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language, mounted, toggleLanguage } = useLanguage();

  const navItems = navKeys.map((item) => ({ href: item.href, label: t(item.key) }));
  const secondaryNavItems = secondaryNavKeys.map((item) => ({ href: item.href, label: t(item.key) }));

  const actions = (
    <>
      <LanguageSwitcher
        language={language}
        mounted={mounted}
        onToggle={toggleLanguage}
        labels={{ switchToEnglish: t('common.english'), switchToFrench: t('common.french') }}
      />
      <DarkModeToggle labels={{ switchToDark: t('darkMode.switchToDark'), switchToLight: t('darkMode.switchToLight') }} />
    </>
  );

  return (
    <Header
      homeUrl="/"
      navItems={navItems}
      secondaryNavItems={secondaryNavItems}
      currentPath={pathname}
      actions={actions}
      menuLabels={{ open: t('common.openMenu'), close: t('common.closeMenu') }}
    />
  );
}
