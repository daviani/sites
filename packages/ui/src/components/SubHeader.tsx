'use client';

interface NavItem {
  href: string;
  label: string;
}

interface SubHeaderProps {
  items: NavItem[];
  currentPath: string;
  showSeparators?: boolean;
  ariaLabel?: string;
}

export function SubHeader({ items, currentPath, showSeparators = false, ariaLabel = 'Navigation' }: SubHeaderProps) {
  const baseStyles =
    'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';
  const inactiveStyles =
    'text-fg-muted hover:text-fg hover:bg-surface-hi';
  const activeStyles =
    'text-fg dark:text-accent bg-surface-hi dark:bg-surface font-semibold';

  return (
    <nav
      className="hidden md:block fixed top-[var(--height-header-offset)] left-[var(--spacing-edge)] right-[var(--spacing-edge)] z-40 glass-card"
      aria-label={ariaLabel}
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
                  {item.label}
                </a>
                {showSeparators && !isLast && (
                  <span className="mx-1 text-fg-muted" aria-hidden="true">
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
