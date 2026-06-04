import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleContent } from '@/components/blog/ArticleContent';

vi.mock('@/hooks/use-language', () => ({
  useLanguage: () => ({
    language: 'fr',
    mounted: true,
    setLanguage: vi.fn(),
    toggleLanguage: vi.fn(),
  }),
}));

describe('ArticleContent', () => {
  const mockArticle = {
    slug: 'test-article',
    content: '## French Content\n\nThis is the article content.',
    contentEn: '## English Content\n\nThis is the English content.',
    meta: {
      slug: 'test-article',
      publishedAt: '2026-01-30',
      titleFr: 'Titre en Francais',
      titleEn: 'Title in English',
      excerptFr: 'Extrait en francais',
      excerptEn: 'Excerpt in English',
      tags: ['typescript', 'react'],
      featured: false,
    },
  };

  // The body is now pre-rendered on the server and passed as a prop.
  const bodyFr = <div data-testid="body-fr">French body</div>;
  const bodyEn = <div data-testid="body-en">English body</div>;

  it('renders article title', () => {
    render(<ArticleContent article={mockArticle} bodyFr={bodyFr} bodyEn={bodyEn} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre en Francais');
  });

  it('renders article excerpt', () => {
    render(<ArticleContent article={mockArticle} bodyFr={bodyFr} bodyEn={bodyEn} />);
    expect(screen.getByText('Extrait en francais')).toBeInTheDocument();
  });

  it('renders article tags', () => {
    render(<ArticleContent article={mockArticle} bodyFr={bodyFr} bodyEn={bodyEn} />);
    expect(screen.getByText('#typescript')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<ArticleContent article={mockArticle} bodyFr={bodyFr} bodyEn={bodyEn} />);
    const time = screen.getByRole('time');
    expect(time).toHaveAttribute('datetime', '2026-01-30');
  });

  it('renders the provided French body', () => {
    render(<ArticleContent article={mockArticle} bodyFr={bodyFr} bodyEn={bodyEn} />);
    expect(screen.getByTestId('body-fr')).toBeInTheDocument();
  });

  it('renders tags as links to the blog tag filter', () => {
    render(<ArticleContent article={mockArticle} bodyFr={bodyFr} bodyEn={bodyEn} />);
    const tagLink = screen.getByText('#typescript').closest('a');
    expect(tagLink).toHaveAttribute('href', '/blog?tag=typescript');
  });

  it('renders article without tags', () => {
    const articleNoTags = {
      ...mockArticle,
      meta: { ...mockArticle.meta, tags: [] },
    };
    render(<ArticleContent article={articleNoTags} bodyFr={bodyFr} bodyEn={bodyEn} />);
    expect(screen.getByText('Titre en Francais')).toBeInTheDocument();
    expect(screen.queryByText('#')).not.toBeInTheDocument();
  });
});
