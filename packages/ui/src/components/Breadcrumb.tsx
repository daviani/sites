'use client';

import { useTranslation, TranslationKey } from '../hooks/use-translation';

export interface BreadcrumbItem {
  href: string;
  labelKey: TranslationKey;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentLabel?: string;
}

export function Breadcrumb({ items, currentLabel }: BreadcrumbProps) {
  const { t } = useTranslation();

  const allItems = [{ href: '/', labelKey: 'common.home' as TranslationKey }, ...items];

  return (
    <nav aria-label={t('common.breadcrumb')} className="text-sm">
      <ol className="flex items-center gap-2 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1 && !currentLabel;
          const label = t(item.labelKey);

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span
                  className="text-nord-3 dark:text-nord-4"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="text-nord-0 dark:text-nord-6 font-medium"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-nord-3 dark:text-nord-4 hover:text-nord-10 dark:hover:text-nord-8 transition-colors focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2 rounded"
                >
                  {label}
                </a>
              )}
            </li>
          );
        })}
        {currentLabel && (
          <li className="flex items-center gap-2">
            <span
              className="text-nord-3 dark:text-nord-4"
              aria-hidden="true"
            >
              /
            </span>
            <span
              className="text-nord-0 dark:text-nord-6 font-medium"
              aria-current="page"
            >
              {currentLabel}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
