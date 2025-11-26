import { render, screen } from '@testing-library/react';
import { Header } from '../src/components/Header';

// Mock useTheme hook used by DarkModeToggle
jest.mock('../src/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    mounted: true,
  }),
}));

// Mock useLanguage hook used by LanguageSwitcher
jest.mock('../src/hooks/use-language', () => ({
  useLanguage: () => ({
    language: 'fr',
    setLanguage: jest.fn(),
    toggleLanguage: jest.fn(),
    mounted: true,
  }),
}));

// Mock useTranslation hook
jest.mock('../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'darkMode.switchToDark': 'Switch to dark mode',
        'darkMode.switchToLight': 'Switch to light mode',
        'common.languageSelection': 'Language selection',
        'common.french': 'Français',
        'common.english': 'Anglais',
      };
      return translations[key] || key;
    },
    language: 'fr',
    mounted: true,
  }),
}));

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders with default logo text', () => {
      render(<Header />);
      expect(screen.getByText('Daviani')).toBeInTheDocument();
      expect(screen.getByText('dev')).toBeInTheDocument();
    });

    it('renders as header element', () => {
      const { container } = render(<Header />);
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('renders OwlLogo SVG', () => {
      const { container } = render(<Header />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('renders custom logo when provided', () => {
      render(<Header logo={<span>My Logo</span>} />);
      expect(screen.getByText('My Logo')).toBeInTheDocument();
      expect(screen.queryByText('Daviani')).not.toBeInTheDocument();
    });

    it('renders children in actions area', () => {
      render(
        <Header>
          <button>Dark Mode</button>
        </Header>
      );
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('accepts custom className', () => {
      const { container } = render(<Header className="test-class" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('test-class');
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('w-full');
      expect(header?.className).toContain('border-b');
      expect(header?.className).toContain('transition-colors');
    });

    it('applies Nord theme colors', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('border-nord-4');
      expect(header?.className).toContain('bg-nord-6');
    });

    it('applies dark mode classes', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('dark:border-nord-3');
      expect(header?.className).toContain('dark:bg-nord-0');
    });
  });

  describe('Layout Structure', () => {
    it('has responsive max-width container', () => {
      const { container } = render(<Header />);
      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toBeInTheDocument();
    });

    it('has flex layout with justify-between', () => {
      const { container } = render(<Header />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('maintains fixed height', () => {
      const { container } = render(<Header />);
      const flexContainer = container.querySelector('.h-16');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('DarkModeToggle Integration', () => {
    it('renders DarkModeToggle button', () => {
      render(<Header />);
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });
});
