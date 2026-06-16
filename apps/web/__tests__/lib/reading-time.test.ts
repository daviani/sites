import { describe, it, expect } from 'vitest';
import { readingMinutes } from '@/lib/reading-time';

describe('readingMinutes', () => {
  it('plancher à 1 minute pour un contenu court', () => {
    expect(readingMinutes('Trois mots ici', 'fr')).toBe(1);
  });

  it('calcule selon le WPM français (220)', () => {
    const content = Array(440).fill('mot').join(' '); // 440 / 220 = 2
    expect(readingMinutes(content, 'fr')).toBe(2);
  });

  it('lit plus vite en anglais (240 wpm)', () => {
    const content = Array(480).fill('word').join(' '); // 480 / 240 = 2
    expect(readingMinutes(content, 'en')).toBe(2);
  });
});
