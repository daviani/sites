import { render, screen } from '@testing-library/react';
import {
  generateStaticParams,
  generateMetadata,
} from '@/app/blog/[slug]/page';
import { getArticleBySlug } from '@/lib/content/blog';

describe('Blog Article Page', () => {
  describe('generateStaticParams', () => {
    it('returns an array of slug params', async () => {
      const params = await generateStaticParams();
      expect(Array.isArray(params)).toBe(true);
      params.forEach((param) => {
        expect(param).toHaveProperty('slug');
        expect(typeof param.slug).toBe('string');
      });
    });
  });

  describe('generateMetadata', () => {
    it('returns metadata for valid article', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'hello-world' }),
      });
      expect(metadata.title).toBe('Hello World');
      expect(metadata.description).toBeDefined();
    });

    it('returns fallback title for non-existent article', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'non-existent-slug-12345' }),
      });
      expect(metadata.title).toBe('Article non trouvé');
    });

    it('generates OpenGraph metadata for valid article', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'hello-world' }),
      });
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe('Hello World');
      expect(metadata.openGraph?.type).toBe('article');
    });
  });

  describe('getArticleBySlug integration', () => {
    it('returns article data for valid slug', () => {
      const article = getArticleBySlug('hello-world');
      expect(article).not.toBeNull();
      expect(article?.meta.title).toBe('Hello World');
      expect(article?.meta.status).toBe('published');
    });

    it('returns null for non-existent slug', () => {
      const article = getArticleBySlug('non-existent-article-12345');
      expect(article).toBeNull();
    });

    it('returns article with all required meta fields', () => {
      const article = getArticleBySlug('hello-world');
      expect(article?.meta.title).toBeDefined();
      expect(article?.meta.description).toBeDefined();
      expect(article?.meta.date).toBeDefined();
      expect(article?.meta.tags).toBeDefined();
      expect(Array.isArray(article?.meta.tags)).toBe(true);
    });
  });
});
