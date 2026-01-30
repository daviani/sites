import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturedArticle } from '@/components/blog/FeaturedArticles';

vi.mock('@daviani/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'blog.featured': 'A la une',
        'blog.readArticle': 'Lire l\'article',
      };
      return translations[key] || key;
    },
  }),
  useLanguage: () => ({
    language: 'fr',
    mounted: true,
  }),
}));

describe('FeaturedArticle', () => {
  const mockArticle = {
    slug: 'featured-article',
    content: 'Article content',
    meta: {
      slug: 'featured-article',
      publishedAt: '2026-01-30',
      titleFr: 'Article en vedette',
      titleEn: 'Featured Article',
      excerptFr: 'Ceci est un article vedette',
      excerptEn: 'This is a featured article',
      tags: ['typescript', 'nextjs'],
      featured: true,
    },
  };

  it('renders the featured badge', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('A la une')).toBeInTheDocument();
  });

  it('renders article title', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Article en vedette');
  });

  it('renders article excerpt', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('Ceci est un article vedette')).toBeInTheDocument();
  });

  it('renders article tags', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<FeaturedArticle article={mockArticle} />);

    const time = screen.getByRole('time');
    expect(time).toHaveAttribute('datetime', '2026-01-30');
  });

  it('links to the article', () => {
    render(<FeaturedArticle article={mockArticle} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/featured-article');
  });

  it('renders read more text', () => {
    render(<FeaturedArticle article={mockArticle} />);

    expect(screen.getByText("Lire l'article")).toBeInTheDocument();
  });

  it('renders article without tags', () => {
    const articleNoTags = {
      ...mockArticle,
      meta: { ...mockArticle.meta, tags: [] },
    };
    render(<FeaturedArticle article={articleNoTags} />);

    expect(screen.getByText('Article en vedette')).toBeInTheDocument();
    // Separator should not be present
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });
});
