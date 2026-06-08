import type { HTMLAttributes } from 'react';

interface FoxLogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

/**
 * Tulikettu — renard de feu. Logo theme-aware SANS JavaScript : la variante est
 * choisie par CSS via `.dark .fox-logo` (background-image), à spécificité normale.
 * La classe `.dark` est posée sur <html> AVANT le paint par le script bloquant →
 * bonne variante dès la première frame, donc pas de flash blanc au refresh et un
 * rendu fiable cross-browser (Safari inclus, là où le toggle JS/`dark:` échouait).
 * Décoratif → aria-hidden. Voir `.fox-logo` dans globals.css.
 */
export function FoxLogo({ size = 32, className = '', style, ...rest }: FoxLogoProps) {
  return (
    <div
      aria-hidden="true"
      className={`fox-logo ${className}`.trim()}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
}
