'use client';

import { useTheme } from '../hooks/use-theme';

interface FoxLogoProps {
  size?: number;
  className?: string;
}

/**
 * Tulikettu — renard de feu + traînée d'aurore. Logo complet raster, theme-aware.
 * Une seule <img> dont la source suit le thème (JS) : variante navy (onlight) en
 * clair, ivoire (ondark) en sombre. Pas de toggle CSS display → fiable cross-browser
 * (évite le bug de cascade :where() côté Safari).
 */
export function FoxLogo({ size = 32, className = '' }: FoxLogoProps) {
  const { theme } = useTheme();
  const src =
    theme === 'dark'
      ? '/brand/tulikettu-full-ondark-512.png'
      : '/brand/tulikettu-full-onlight-512.png';

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      suppressHydrationWarning
    />
  );
}
