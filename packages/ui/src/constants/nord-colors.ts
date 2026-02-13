/**
 * Nord Theme color palette as hex constants.
 *
 * Use these values in contexts where Tailwind CSS classes are not available:
 * - Canvas drawing (matrix rain, confetti)
 * - Inline styles (OG images, PDF generation)
 * - SVG attributes
 *
 * For Tailwind CSS, use the class-based tokens (e.g. `bg-nord-0`, `text-nord-8`).
 */

// Polar Night — dark backgrounds
export const NORD_0 = '#2E3440';
export const NORD_1 = '#3B4252';
export const NORD_2 = '#434C5E';
export const NORD_3 = '#4C566A';

// Snow Storm — light foregrounds
export const NORD_4 = '#D8DEE9';
export const NORD_5 = '#E5E9F0';
export const NORD_6 = '#ECEFF4';

// Frost — accent blues/teals
export const NORD_7 = '#8FBCBB';
export const NORD_8 = '#88C0D0';
export const NORD_9 = '#81A1C1';
export const NORD_10 = '#5E81AC';

// Aurora — semantic colors
export const NORD_11 = '#BF616A'; // red / error
export const NORD_12 = '#D08770'; // orange / warning
export const NORD_13 = '#EBCB8B'; // yellow / info
export const NORD_14 = '#A3BE8C'; // green / success
export const NORD_15 = '#B48EAD'; // purple / accent

/** Full palette as a keyed object (useful for PDF generation, etc.) */
export const NORD = {
  nord0: NORD_0,
  nord1: NORD_1,
  nord2: NORD_2,
  nord3: NORD_3,
  nord4: NORD_4,
  nord5: NORD_5,
  nord6: NORD_6,
  nord7: NORD_7,
  nord8: NORD_8,
  nord9: NORD_9,
  nord10: NORD_10,
  nord11: NORD_11,
  nord12: NORD_12,
  nord13: NORD_13,
  nord14: NORD_14,
  nord15: NORD_15,
} as const;

/** Aurora colors array (for confetti, particles, etc.) */
export const NORD_AURORA = [NORD_8, NORD_9, NORD_10, NORD_11, NORD_12, NORD_13, NORD_14, NORD_15] as const;
