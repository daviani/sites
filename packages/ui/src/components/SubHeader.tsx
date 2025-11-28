'use client';

import { useTranslation, TranslationKey } from '../hooks/use-translation';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
}

interface SubHeaderProps {
  items: NavItem[];
  currentPath: string;
}

export function SubHeader({ items, currentPath }: SubHeaderProps) {
  const { t } = useTranslation();

  const baseStyles =
    'px-4 py-2 text-sm font-medium rounded-lg transition-colors';
  const inactiveStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6 hover:bg-nord-5 dark:hover:bg-nord-2';
  const activeStyles =
    'text-nord-0 dark:text-nord-6 bg-nord-5 dark:bg-nord-2';

  return (
    <nav
      className="bg-nord-6 dark:bg-nord-0 border-b border-nord-5 dark:border-nord-1"
      aria-label={t('nav.portfolio.title')}
    >
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-2 py-2">
          {items.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
