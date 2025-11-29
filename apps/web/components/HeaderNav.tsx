'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@daviani/ui';
import { getSubdomainUrl, getBaseUrl, ValidSubdomain } from '@/lib/domains/config';

const navItems: { subdomain: ValidSubdomain; labelKey: 'nav.portfolio.title' | 'nav.blog.title' | 'nav.cv.title' | 'nav.contact.title' | 'nav.rdv.title' }[] = [
  { subdomain: 'portfolio', labelKey: 'nav.portfolio.title' },
  { subdomain: 'blog', labelKey: 'nav.blog.title' },
  { subdomain: 'cv', labelKey: 'nav.cv.title' },
  { subdomain: 'contact', labelKey: 'nav.contact.title' },
  { subdomain: 'rdv', labelKey: 'nav.rdv.title' },
];

export function HeaderNav() {
  const pathname = usePathname();

  const items = navItems.map((item) => ({
    href: getSubdomainUrl(item.subdomain),
    labelKey: item.labelKey,
  }));

  return <Header homeUrl={getBaseUrl()} navItems={items} currentPath={pathname} />;
}
