import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

vi.mock('@/lib/markdoc', () => ({
  MarkdocContent: ({ content }: { content: string }) => <div data-testid="markdoc">{content}</div>,
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

  it('renders article title', () => {
    render(<ArticleContent article={mockArticle} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre en Francais');
  });

  it('renders article excerpt', () => {
    render(<ArticleContent article={mockArticle} />);

    expect(screen.getByText('Extrait en francais')).toBeInTheDocument();
  });

  it('renders article tags', () => {
    render(<ArticleContent article={mockArticle} />);

    expect(screen.getByText('#typescript')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<ArticleContent article={mockArticle} />);

    const time = screen.getByRole('time');
    expect(time).toHaveAttribute('datetime', '2026-01-30');
  });

  it('renders article content via MarkdocContent', () => {
    render(<ArticleContent article={mockArticle} />);

    expect(screen.getByTestId('markdoc')).toHaveTextContent('## French Content');
  });

  it('renders tags as links', () => {
    render(<ArticleContent article={mockArticle} />);

    const tagLink = screen.getByText('#typescript').closest('a');
    expect(tagLink).toHaveAttribute('href', '/?tag=typescript');
  });

  it('renders article without tags', () => {
    const articleNoTags = {
      ...mockArticle,
      meta: { ...mockArticle.meta, tags: [] },
    };
    render(<ArticleContent article={articleNoTags} />);

    expect(screen.getByText('Titre en Francais')).toBeInTheDocument();
    expect(screen.queryByText('#')).not.toBeInTheDocument();
  });
});

describe('ArticleContent - English', () => {
  beforeEach(() => {
    vi.doMock('@/hooks/use-language', () => ({
      useLanguage: () => ({
        language: 'en',
        mounted: true,
        setLanguage: vi.fn(),
        toggleLanguage: vi.fn(),
      }),
    }));
  });

  afterEach(() => {
    vi.doUnmock('@/hooks/use-language');
  });
});
