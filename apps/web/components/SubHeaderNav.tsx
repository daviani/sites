'use client';

import { usePathname } from 'next/navigation';
import { SubHeader } from '@daviani/ui';
import { getSubdomainUrl, ValidSubdomain } from '@/lib/domains/config';

const navItems: {
  subdomain: ValidSubdomain;
  labelKey:
    | 'nav.portfolio.title'
    | 'nav.blog.title'
    | 'nav.cv.title'
    | 'nav.contact.title'
    | 'nav.rdv.title'
    | 'nav.accessibility.title'
    | 'nav.sitemap.title'
    | 'nav.help.title';
}[] = [
  { subdomain: 'portfolio', labelKey: 'nav.portfolio.title' },
  { subdomain: 'blog', labelKey: 'nav.blog.title' },
  { subdomain: 'cv', labelKey: 'nav.cv.title' },
  { subdomain: 'contact', labelKey: 'nav.contact.title' },
  { subdomain: 'rdv', labelKey: 'nav.rdv.title' },
  { subdomain: 'accessibility', labelKey: 'nav.accessibility.title' },
  { subdomain: 'sitemap', labelKey: 'nav.sitemap.title' },
  { subdomain: 'help', labelKey: 'nav.help.title' },
];

export function SubHeaderNav() {
  const pathname = usePathname();

  const items = navItems.map((item) => ({
    href: getSubdomainUrl(item.subdomain),
    labelKey: item.labelKey,
  }));

  return <SubHeader items={items} currentPath={pathname} />;
}
