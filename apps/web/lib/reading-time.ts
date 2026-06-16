import readingTime from 'reading-time';

/**
 * Temps de lecture estimé d'un corps Markdoc, en minutes (plancher à 1).
 * Vitesses calées sur les standards de lecture : ~220 mots/min en français,
 * ~240 en anglais. `reading-time` (ngryman) gère le décompte (markdown, CJK…).
 */
export function readingMinutes(content: string, lang: 'fr' | 'en' = 'fr'): number {
  const wordsPerMinute = lang === 'en' ? 240 : 220;
  return Math.max(1, Math.ceil(readingTime(content, { wordsPerMinute }).minutes));
}
