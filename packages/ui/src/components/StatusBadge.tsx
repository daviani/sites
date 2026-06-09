import type { ReactNode } from 'react';

/**
 * Variantes sémantiques tokenisées (DS Tulikettu). On évite toute couleur
 * hors-système : chaque variante ne référence que des tokens existants.
 * - neutral : état discret (ex. Privé)
 * - success : état positif/en ligne (ex. En ligne)
 * - accent  : mise en avant via l'accent primaire du DS (ex. Lab)
 * - warn    : état d'attente (ex. À venir)
 */
export type StatusBadgeVariant = 'neutral' | 'success' | 'accent' | 'warn';

// Fonds opaques (color-mix avec la surface) plutôt que des teintes transparentes :
// contraste déterministe et conforme AA quel que soit l'arrière-plan.
const VARIANT_CLASS: Record<StatusBadgeVariant, string> = {
  neutral: 'bg-surface-hi text-fg-muted',
  success: 'bg-[color-mix(in_oklab,var(--tuli-ok)_10%,var(--tuli-surface))] text-ok',
  accent: 'bg-[color-mix(in_oklab,var(--tuli-accent)_10%,var(--tuli-surface))] text-accent',
  warn: 'bg-[color-mix(in_oklab,var(--tuli-warn)_10%,var(--tuli-surface))] text-warn',
};

export interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ variant = 'neutral', children, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${VARIANT_CLASS[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
