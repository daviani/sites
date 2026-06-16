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
      updatedAt: '',
      titleFr: 'Titre en Francais',
      titleEn: 'Title in English',
      excerptFr: 'Extrait en francais',
      excerptEn: 'Excerpt in English',
      tags: ['typescript', 'react'],
      featured: false,
    },
  };

  // Le corps est désormais pré-rendu côté serveur et passé en prop.
  const bodyFr = <div data-testid="body-fr">Corps FR</div>;
  const bodyEn = <div data-testid="body-en">Corps EN</div>;

  const renderArticle = (article = mockArticle) =>
    render(<ArticleContent article={article} bodyFr={bodyFr} bodyEn={bodyEn} />);

  it('renders article title', () => {
    renderArticle();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre en Francais');
  });

  it('donne un id au titre pour l’aria-labelledby de l’article', () => {
    renderArticle();
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'article-title');
  });

  it('affiche l’attribution auteur (rel=author vers /about)', () => {
    renderArticle();
    const author = screen.getByRole('link', { name: 'Daviani Fillatre' });
    expect(author).toHaveAttribute('rel', 'author');
    expect(author).toHaveAttribute('href', '/about');
  });

  it('renders article excerpt', () => {
    renderArticle();
    expect(screen.getByText('Extrait en francais')).toBeInTheDocument();
  });

  it('renders article tags', () => {
    renderArticle();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    renderArticle();
    const time = screen.getByRole('time');
    expect(time).toHaveAttribute('datetime', '2026-01-30');
  });

  it('renders the pre-rendered French body', () => {
    renderArticle();
    expect(screen.getByTestId('body-fr')).toBeInTheDocument();
  });

  it('renders tags as links to /blog', () => {
    renderArticle();
    const tagLink = screen.getByText('#typescript').closest('a');
    expect(tagLink).toHaveAttribute('href', '/blog?tag=typescript');
  });

  it('renders article without tags', () => {
    const articleNoTags = {
      ...mockArticle,
      meta: { ...mockArticle.meta, tags: [] },
    };
    renderArticle(articleNoTags);
    expect(screen.getByText('Titre en Francais')).toBeInTheDocument();
    expect(screen.queryByText('#')).not.toBeInTheDocument();
  });
});
