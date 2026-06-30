import { describe, it, expect } from 'vitest';
import { metadata } from '@/app/(site)/not-found';

describe('page 404 (not-found)', () => {
  it('est en noindex pour ne pas être indexée (follow conservé)', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it('annule le canonical « / » hérité du layout racine', () => {
    expect(metadata.alternates?.canonical).toBeNull();
  });
});
