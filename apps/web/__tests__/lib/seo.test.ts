import { describe, it, expect } from 'vitest';
import {
  personJsonLd,
  cvPersonJsonLd,
  projectJsonLd,
  projectsCollectionJsonLd,
  blogCollectionJsonLd,
  pageMetadata,
  ogImageUrl,
} from '@/lib/seo';
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

    it('porte une image OG contextuelle (bannière au nom du projet)', () => {
      const work = projectJsonLd({ name: 'RØDD', description: 'x', slug: 'rodd', stack: [] });
      expect(work.image).toBe(`${base}${ogImageUrl('RØDD')}`);
    });
  });

  describe('projectsCollectionJsonLd', () => {
    it('produit une CollectionPage + ItemList ordonnée liée au WebSite', () => {
      const coll = projectsCollectionJsonLd([
        { name: 'RØDD', slug: 'rodd' },
        { name: 'Maasto', slug: 'maasto' },
      ]);
      expect(coll['@type']).toBe('CollectionPage');
      expect(coll.isPartOf).toEqual({ '@id': `${base}/#website` });
      const list = coll.mainEntity as { '@type': string; itemListElement: Array<Record<string, unknown>> };
      expect(list['@type']).toBe('ItemList');
      expect(list.itemListElement).toHaveLength(2);
      expect(list.itemListElement[0]).toMatchObject({
        position: 1,
        url: `${base}/projets/rodd`,
        name: 'RØDD',
      });
    });
  });

  describe('blogCollectionJsonLd', () => {
    it('produit un Blog avec les BlogPosting et l’auteur unifié par @id', () => {
      const blog = blogCollectionJsonLd([
        { title: 'Titre', slug: 'titre', publishedAt: '2026-06-10', description: 'desc' },
      ]);
      expect(blog['@type']).toBe('Blog');
      expect(blog.isPartOf).toEqual({ '@id': `${base}/#website` });
      expect(blog.author).toMatchObject({ '@id': PERSON_ID });
      const posts = blog.blogPost as Array<Record<string, unknown>>;
      expect(posts[0]).toMatchObject({
        '@type': 'BlogPosting',
        headline: 'Titre',
        url: `${base}/blog/titre`,
      });
    });
  });
});

describe('pageMetadata', () => {
  it('n’annonce plus de locale alternative (i18n cookie-only, pas de routes /en/)', () => {
    const meta = pageMetadata({ title: 'Projets', description: 'd', path: '/projets' });
    expect(meta.openGraph).not.toHaveProperty('alternateLocale');
  });

  it('utilise la bannière OG contextuelle quand ogImage est fourni', () => {
    const og = ogImageUrl('RØDD', 'App d’aviron');
    const meta = pageMetadata({ title: 'RØDD', description: 'd', path: '/projets/rodd', ogImage: og });
    const images = (meta.openGraph as { images: Array<{ url: string }> }).images;
    expect(images[0].url).toBe(og);
  });

  it('retombe sur la bannière de marque sans ogImage', () => {
    const meta = pageMetadata({ title: 'Blog', description: 'd', path: '/blog' });
    const images = (meta.openGraph as { images: Array<{ url: string }> }).images;
    expect(images[0].url).toBe('/api/og');
  });
});

describe('ogImageUrl', () => {
  it('encode le titre et le sous-titre en query params', () => {
    expect(ogImageUrl('A & B')).toBe('/api/og?title=A+%26+B');
    expect(ogImageUrl('Titre', 'Sous-titre')).toBe('/api/og?title=Titre&subtitle=Sous-titre');
  });
});
