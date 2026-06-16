import { describe, it, expect } from 'vitest';
import { personJsonLd, cvPersonJsonLd, projectJsonLd } from '@/lib/seo';
import { getBaseUrl } from '@/lib/domains/config';

const base = getBaseUrl();
const PERSON_ID = `${base}/#person`;

describe('JSON-LD', () => {
  describe('personJsonLd', () => {
    it('expose un @id stable pour unifier l’entité Person entre les pages', () => {
      const p = personJsonLd();
      expect(p['@type']).toBe('Person');
      expect(p['@id']).toBe(PERSON_ID);
    });
  });

  describe('cvPersonJsonLd', () => {
    it('hérite du Person (même @id) et ajoute une occupation avec compétences', () => {
      const cv = cvPersonJsonLd();
      expect(cv['@id']).toBe(PERSON_ID);
      expect(cv.hasOccupation).toMatchObject({ '@type': 'Occupation' });
      expect((cv.hasOccupation as { skills: string[] }).skills.length).toBeGreaterThan(0);
    });
  });

  describe('projectJsonLd', () => {
    it('produit un CreativeWork lié au Person principal par @id', () => {
      const work = projectJsonLd({
        name: 'RØDD',
        description: 'App iOS d’aviron',
        slug: 'rodd',
        stack: ['SwiftUI', 'BLE'],
      });
      expect(work['@type']).toBe('CreativeWork');
      expect(work.url).toBe(`${base}/projets/rodd`);
      expect(work.keywords).toEqual(['SwiftUI', 'BLE']);
      expect(work.author).toMatchObject({ '@type': 'Person', '@id': PERSON_ID });
    });
  });
});
