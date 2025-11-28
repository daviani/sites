import { getAllArticles, getAllTags } from '@/lib/content/blog';

// Note: BlogPage is an async Server Component that doesn't render well in jsdom
// Testing the underlying functions instead

describe('Blog Page Functions', () => {
  it('getAllArticles returns an array', () => {
    const articles = getAllArticles();
    expect(Array.isArray(articles)).toBe(true);
  });

  it('getAllTags returns an array', () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
  });

  it('articles have required meta fields', () => {
    const articles = getAllArticles();
    if (articles.length > 0) {
      const article = articles[0];
      expect(article.meta).toBeDefined();
      expect(article.meta.title).toBeDefined();
      expect(article.meta.date).toBeDefined();
      expect(article.meta.tags).toBeDefined();
      expect(article.slug).toBeDefined();
    }
  });
});
