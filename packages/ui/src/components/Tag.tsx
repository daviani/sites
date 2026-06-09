import type { ReactNode } from 'react';

/**
 * Petite étiquette monospace (tag d'article, item de stack…) — DS Tulikettu.
 * N'utilise que des tokens du système (contraste AA garanti quel que soit le thème).
 */
export interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`font-mono text-xs text-fg-muted bg-surface-el border border-surface-hi/55 px-[11px] py-[5px] rounded-lg ${className}`.trim()}
    >
      {children}
    </span>
  );
}
