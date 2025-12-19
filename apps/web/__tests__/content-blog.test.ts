import {
  getAllArticles,
  getArticleBySlug,
  getAllTags,
  getFeaturedArticles,
} from '@/lib/content/blog';

describe('Blog Content Loader', () => {
  describe('getAllArticles', () => {
    it('returns an array', () => {
      const articles = getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it('returns articles sorted by date (newest first)', () => {
      const articles = getAllArticles();
      if (articles.length > 1) {
        for (let i = 0; i < articles.length - 1; i++) {
          expect(new Date(articles[i].meta.publishedAt).getTime())
            .toBeGreaterThanOrEqual(new Date(articles[i + 1].meta.publishedAt).getTime());
        }
      }
    });

    it('each article has required meta fields', () => {
      const articles = getAllArticles();
      articles.forEach((article) => {
        expect(article.slug).toBeDefined();
        expect(article.meta.titleFr).toBeDefined();
        expect(article.meta.titleEn).toBeDefined();
        expect(article.meta.publishedAt).toBeDefined();
      });
    });
  });

  describe('getArticleBySlug', () => {
    it('returns null for non-existent slug', () => {
      const article = getArticleBySlug('non-existent-article-slug-12345');
      expect(article).toBeNull();
    });

    it('returns article with correct slug', () => {
      const articles = getAllArticles();
      if (articles.length > 0) {
        const firstSlug = articles[0].slug;
        const article = getArticleBySlug(firstSlug);
        expect(article).not.toBeNull();
        expect(article?.slug).toBe(firstSlug);
      }
    });
  });

  describe('getAllTags', () => {
    it('returns an array of strings', () => {
      const tags = getAllTags();
      expect(Array.isArray(tags)).toBe(true);
      tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
      });
    });

    it('returns unique tags', () => {
      const tags = getAllTags();
      const uniqueTags = new Set(tags);
      expect(tags.length).toBe(uniqueTags.size);
    });

    it('returns sorted tags', () => {
      const tags = getAllTags();
      const sortedTags = [...tags].sort();
      expect(tags).toEqual(sortedTags);
    });
  });

  describe('getFeaturedArticles', () => {
    it('returns an array', () => {
      const featured = getFeaturedArticles();
      expect(Array.isArray(featured)).toBe(true);
    });

    it('returns only articles with featured: true', () => {
      const featured = getFeaturedArticles();
      featured.forEach((article) => {
        expect(article.meta.featured).toBe(true);
      });
    });

    it('returns subset of all articles', () => {
      const allArticles = getAllArticles();
      const featured = getFeaturedArticles();
      expect(featured.length).toBeLessThanOrEqual(allArticles.length);
    });

    it('featured articles have all required meta fields', () => {
      const featured = getFeaturedArticles();
      featured.forEach((article) => {
        expect(article.slug).toBeDefined();
        expect(article.meta.titleFr).toBeDefined();
        expect(article.meta.titleEn).toBeDefined();
        expect(article.meta.publishedAt).toBeDefined();
        expect(article.meta.featured).toBe(true);
      });
    });
  });

  describe('article content', () => {
    it('articles have content field', () => {
      const articles = getAllArticles();
      articles.forEach((article) => {
        expect(article.content).toBeDefined();
        expect(typeof article.content).toBe('string');
      });
    });

    it('articles may have English content', () => {
      const articles = getAllArticles();
      articles.forEach((article) => {
        // contentEn is optional, but if present should be a string
        if (article.contentEn !== undefined) {
          expect(typeof article.contentEn).toBe('string');
        }
      });
    });
  });
});