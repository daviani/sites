'use client';

import { usePathname } from 'next/navigation';
import { SubHeader } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';

const navKeys = [
  { href: '/about', key: 'nav.about.title' as const },
  { href: '/blog', key: 'nav.blog.title' as const },
  { href: '/cv', key: 'nav.cv.title' as const },
  { href: '/contact', key: 'nav.contact.title' as const },
  { href: '/rdv', key: 'nav.rdv.title' as const },
];

export function SubHeaderNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = navKeys.map((item) => ({ href: item.href, label: t(item.key) }));

  return <SubHeader items={navItems} currentPath={pathname} showSeparators ariaLabel={t('footer.navigation')} />;
}
