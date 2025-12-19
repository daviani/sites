import { render, screen } from './helpers/test-utils';
import { FeaturedArticle } from '@/components/blog/FeaturedArticles';
import type { Article } from '@/lib/content/blog';

// Mock useLanguage to control language state
const mockUseLanguage = jest.fn();

jest.mock('@daviani/ui', () => ({
  ...jest.requireActual('@daviani/ui'),
  useLanguage: () => mockUseLanguage(),
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'blog.featured': 'Featured',
        'blog.readArticle': 'Read article',
      };
      return translations[key] || key;
    },
  }),
}));

const mockArticle: Article = {
  slug: 'test-article',
  meta: {
    slug: 'test-article',
    titleFr: 'Titre en Français',
    titleEn: 'Title in English',
    excerptFr: 'Extrait en français de l\'article.',
    excerptEn: 'English excerpt of the article.',
    publishedAt: '2024-01-15',
    featured: true,
    tags: ['React', 'TypeScript'],
  },
  content: '# Test content',
};

describe('FeaturedArticle', () => {
  beforeEach(() => {
    // Default to French
    mockUseLanguage.mockReturnValue({ language: 'fr', mounted: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the featured badge', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('renders as a link to the article', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-article');
    });

    it('renders the "Read article" call to action', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText('Read article')).toBeInTheDocument();
    });

    it('renders article tags', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('does not render tags section when no tags', () => {
      const articleNoTags: Article = {
        ...mockArticle,
        meta: { ...mockArticle.meta, tags: [] },
      };
      render(<FeaturedArticle article={articleNoTags} />);

      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
  });

  describe('i18n - French', () => {
    beforeEach(() => {
      mockUseLanguage.mockReturnValue({ language: 'fr', mounted: true });
    });

    it('displays French title', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Titre en Français');
    });

    it('displays French excerpt', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText(/Extrait en français/)).toBeInTheDocument();
    });

    it('formats date in French locale', () => {
      render(<FeaturedArticle article={mockArticle} />);

      // French format: "15 janvier 2024"
      expect(screen.getByText(/janvier/i)).toBeInTheDocument();
    });
  });

  describe('i18n - English', () => {
    beforeEach(() => {
      mockUseLanguage.mockReturnValue({ language: 'en', mounted: true });
    });

    it('displays English title', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title in English');
    });

    it('displays English excerpt', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText(/English excerpt/)).toBeInTheDocument();
    });

    it('formats date in English locale', () => {
      render(<FeaturedArticle article={mockArticle} />);

      // English format: "January 15, 2024"
      expect(screen.getByText(/January/i)).toBeInTheDocument();
    });
  });

  describe('SSR fallback', () => {
    it('falls back to French when not mounted', () => {
      mockUseLanguage.mockReturnValue({ language: 'en', mounted: false });
      render(<FeaturedArticle article={mockArticle} />);

      // Should show French content before hydration
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Titre en Français');
    });
  });

  describe('accessibility', () => {
    it('has proper datetime attribute on time element', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime', '2024-01-15');
    });

    it('renders article within semantic article tag', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });
});