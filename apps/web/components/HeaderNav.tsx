'use client';

import { usePathname } from 'next/navigation';
import { Header, TranslationKey } from '@nordic-island/ui';

const navItems: { href: string; labelKey: TranslationKey }[] = [
  { href: '/about', labelKey: 'nav.about.title' },
  { href: '/blog', labelKey: 'nav.blog.title' },
  { href: '/cv', labelKey: 'nav.cv.title' },
  { href: '/contact', labelKey: 'nav.contact.title' },
  { href: '/rdv', labelKey: 'nav.rdv.title' },
];

const secondaryNavItems: { href: string; labelKey: TranslationKey }[] = [
  { href: '/accessibility', labelKey: 'nav.accessibility.title' },
  { href: '/sitemap', labelKey: 'nav.sitemap.title' },
  { href: '/help', labelKey: 'nav.help.title' },
];

export function HeaderNav() {
  const pathname = usePathname();

  return <Header homeUrl="/" navItems={navItems} secondaryNavItems={secondaryNavItems} currentPath={pathname} />;
}
