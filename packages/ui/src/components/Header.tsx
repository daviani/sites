import { ReactNode } from 'react';

export interface HeaderProps {
  children?: ReactNode;
  logo?: ReactNode;
  className?: string;
}

export function Header({ children, logo, className = '' }: HeaderProps) {
  return (
    <header
      className={`w-full border-b border-nord4 dark:border-nord3 bg-nord6 dark:bg-nord0 transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex-shrink-0">
            {logo || (
              <span className="text-xl font-bold text-nord10">
                daviani.dev
              </span>
            )}
          </div>

          {/* Actions (DarkModeToggle, Navigation, etc.) */}
          <div className="flex items-center gap-4">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
