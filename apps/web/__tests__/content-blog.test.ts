import {
  getAllArticles,
  getArticleBySlug,
  getAllTags,
  ArticleMeta
} from '@/lib/content/blog';

describe('Blog Content Loader', () => {
  describe('getAllArticles', () => {
    it('returns an array', () => {
      const articles = getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it('only returns published articles', () => {
      const articles = getAllArticles();
      articles.forEach((article) => {
        expect(article.meta.status).toBe('published');
      });
    });

    it('returns articles sorted by date (newest first)', () => {
      const articles = getAllArticles();
      if (articles.length > 1) {
        for (let i = 0; i < articles.length - 1; i++) {
          expect(new Date(articles[i].meta.date).getTime())
            .toBeGreaterThanOrEqual(new Date(articles[i + 1].meta.date).getTime());
        }
      }
    });

    it('each article has required meta fields', () => {
      const articles = getAllArticles();
      articles.forEach((article) => {
        expect(article.slug).toBeDefined();
        expect(article.meta.title).toBeDefined();
        expect(article.meta.description).toBeDefined();
        expect(article.meta.date).toBeDefined();
        expect(article.meta.status).toBe('published');
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
});
