/**
 * Tulikettu — couleurs aurore en hex, pour les contextes où les classes
 * Tailwind ne s'appliquent pas : canvas (matrix rain, confettis), particules, SVG.
 * Pour le reste, utiliser les tokens (`text-accent`, `bg-surface`…).
 * Source : Design System/Tulikettu final/styles.css (accent aurora boréal).
 */

// Aurore boréale — teintes vives décoratives
export const TULI_CYAN = '#5BB8D4';
export const TULI_EAU = '#67D4A8';
export const TULI_MINT = '#7BE0B5';
export const TULI_VIOLET = '#C084FC';
export const TULI_SKY = '#38BDF8';
export const TULI_EMERALD = '#34D399';

/** Palette aurore (confettis, particules) */
export const TULI_AURORA = [
  TULI_CYAN,
  TULI_EAU,
  TULI_MINT,
  TULI_VIOLET,
  TULI_SKY,
  TULI_EMERALD,
] as const;

/** Vert phosphorescent boréal (matrix rain) */
export const TULI_MATRIX = '#67D4A8';
