'use client';

import { useTranslation, TranslationKey } from '../hooks/use-translation';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
}

interface SubHeaderProps {
  items: NavItem[];
  currentPath: string;
  showSeparators?: boolean;
}

export function SubHeader({ items, currentPath, showSeparators = false }: SubHeaderProps) {
  const { t } = useTranslation();

  const baseStyles =
    'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';
  const inactiveStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6 hover:bg-nord-5 dark:hover:bg-nord-2';
  const activeStyles =
    'text-nord-0 dark:text-nord-6 bg-nord-5 dark:bg-nord-2';

  return (
    <nav
      className="hidden md:block fixed top-[86px] left-[10px] right-[10px] z-40 shadow-lg backdrop-blur-md bg-white/40 dark:bg-nord-3/50 rounded-[2.5rem]"
      aria-label={t('footer.navigation')}
    >
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-1 py-2">
          {items.map((item, index) => {
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center">
                <a
                  href={item.href}
                  className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(item.labelKey)}
                </a>
                {showSeparators && !isLast && (
                  <span className="mx-1 text-nord-3 dark:text-nord-4" aria-hidden="true">
                    •
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
