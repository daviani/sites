'use client';

import { usePathname } from 'next/navigation';
import { SubHeader, TranslationKey } from '@daviani/ui';

const navItems: { href: string; labelKey: TranslationKey }[] = [
  { href: '/about', labelKey: 'nav.about.title' },
  { href: '/blog', labelKey: 'nav.blog.title' },
  { href: '/cv', labelKey: 'nav.cv.title' },
  { href: '/contact', labelKey: 'nav.contact.title' },
  { href: '/rdv', labelKey: 'nav.rdv.title' },
];

export function SubHeaderNav() {
  const pathname = usePathname();

  return <SubHeader items={navItems} currentPath={pathname} showSeparators />;
}
