'use client';

export interface BreadcrumbItem {
  href: string;
  label: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  currentLabel?: string;
  ariaLabel?: string;
}

export function Breadcrumb({ items, homeLabel = 'Home', currentLabel, ariaLabel = 'Breadcrumb' }: BreadcrumbProps) {
  const allItems = [{ href: '/', label: homeLabel }, ...items];

  return (
    <nav aria-label={ariaLabel} className="text-base">
      <ol className="flex items-center gap-2 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1 && !currentLabel;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span
                  className="text-nord-3 dark:text-nord-4"
                  aria-hidden="true"
                >
                  ›
                </span>
              )}
              {isLast ? (
                <span
                  className="text-nord-0 dark:text-nord-6 font-semibold"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-nord-3 dark:text-nord-4 hover:text-nord-10 dark:hover:text-nord-8 hover:underline underline-offset-4 transition-all focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2 rounded px-1 -mx-1"
                >
                  {item.label}
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
              ›
            </span>
            <span
              className="text-nord-0 dark:text-nord-6 font-semibold"
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
