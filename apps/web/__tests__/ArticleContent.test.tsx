import { render, screen } from './helpers/test-utils';
import { ArticleContent } from '@/components/blog/ArticleContent';
import type { Article } from '@/lib/content/blog';

// Mock useLanguage to control language state
const mockUseLanguage = jest.fn();

jest.mock('@daviani/ui', () => ({
  ...jest.requireActual('@daviani/ui'),
  useLanguage: () => mockUseLanguage(),
}));

// Mock MarkdocContent to simplify testing
jest.mock('@/lib/markdoc', () => ({
  MarkdocContent: ({ content }: { content: string }) => (
    <div data-testid="markdoc-content">{content}</div>
  ),
}));

const mockArticle: Article = {
  slug: 'test-article',
  meta: {
    slug: 'test-article',
    titleFr: 'Titre de Test',
    titleEn: 'Test Title',
    excerptFr: 'Ceci est un extrait en français.',
    excerptEn: 'This is an English excerpt.',
    publishedAt: '2024-03-20',
    featured: false,
    tags: ['JavaScript', 'Testing'],
  },
  content: '# Contenu en français\n\nParagraphe de test.',
  contentEn: '# English content\n\nTest paragraph.',
};

const mockArticleNoEnglish: Article = {
  ...mockArticle,
  contentEn: undefined,
};

describe('ArticleContent', () => {
  beforeEach(() => {
    mockUseLanguage.mockReturnValue({ language: 'fr', mounted: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('header rendering', () => {
    it('renders the article title as h1', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders the excerpt', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText(/extrait en français/i)).toBeInTheDocument();
    });

    it('renders the publication date', () => {
      render(<ArticleContent article={mockArticle} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime', '2024-03-20');
    });

    it('renders all tags as links', () => {
      render(<ArticleContent article={mockArticle} />);

      const jsLink = screen.getByRole('link', { name: /#JavaScript/i });
      const testLink = screen.getByRole('link', { name: /#Testing/i });

      expect(jsLink).toHaveAttribute('href', '/?tag=JavaScript');
      expect(testLink).toHaveAttribute('href', '/?tag=Testing');
    });

    it('does not render tags section when no tags', () => {
      const articleNoTags: Article = {
        ...mockArticle,
        meta: { ...mockArticle.meta, tags: [] },
      };
      render(<ArticleContent article={articleNoTags} />);

      // Should not have any tag links (links with # prefix)
      expect(screen.queryByRole('link', { name: /#JavaScript/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /#Testing/i })).not.toBeInTheDocument();
    });
  });

  describe('content rendering', () => {
    it('renders Markdoc content', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByTestId('markdoc-content')).toBeInTheDocument();
    });

    it('passes French content to Markdoc when language is French', () => {
      mockUseLanguage.mockReturnValue({ language: 'fr', mounted: true });
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByTestId('markdoc-content')).toHaveTextContent('Contenu en français');
    });

    it('passes English content to Markdoc when language is English', () => {
      mockUseLanguage.mockReturnValue({ language: 'en', mounted: true });
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByTestId('markdoc-content')).toHaveTextContent('English content');
    });

    it('falls back to French content when English content is missing', () => {
      mockUseLanguage.mockReturnValue({ language: 'en', mounted: true });
      render(<ArticleContent article={mockArticleNoEnglish} />);

      expect(screen.getByTestId('markdoc-content')).toHaveTextContent('Contenu en français');
    });
  });

  describe('i18n - French', () => {
    beforeEach(() => {
      mockUseLanguage.mockReturnValue({ language: 'fr', mounted: true });
    });

    it('displays French title', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre de Test');
    });

    it('displays French excerpt', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText(/Ceci est un extrait en français/)).toBeInTheDocument();
    });

    it('formats date in French locale', () => {
      render(<ArticleContent article={mockArticle} />);

      // French: "20 mars 2024"
      expect(screen.getByText(/mars/i)).toBeInTheDocument();
    });
  });

  describe('i18n - English', () => {
    beforeEach(() => {
      mockUseLanguage.mockReturnValue({ language: 'en', mounted: true });
    });

    it('displays English title', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
    });

    it('displays English excerpt', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText(/This is an English excerpt/)).toBeInTheDocument();
    });

    it('formats date in English locale', () => {
      render(<ArticleContent article={mockArticle} />);

      // English: "March 20, 2024"
      expect(screen.getByText(/March/i)).toBeInTheDocument();
    });
  });

  describe('SSR fallback', () => {
    it('falls back to French when not mounted', () => {
      mockUseLanguage.mockReturnValue({ language: 'en', mounted: false });
      render(<ArticleContent article={mockArticle} />);

      // Before hydration, should show French
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre de Test');
      expect(screen.getByTestId('markdoc-content')).toHaveTextContent('Contenu en français');
    });
  });

  describe('accessibility', () => {
    it('uses semantic header element', () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('has proper datetime attribute', () => {
      render(<ArticleContent article={mockArticle} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime', '2024-03-20');
    });
  });
});