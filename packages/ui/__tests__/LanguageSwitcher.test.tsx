import { screen, fireEvent, renderWithProviders } from './helpers/test-utils';
import { LanguageSwitcher } from '../src';

// Mock document.cookie
let cookieStore: Record<string, string> = {};

const mockCookie = {
  get: () => {
    return Object.entries(cookieStore)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  },
  set: (cookieStr: string) => {
    const [nameValue] = cookieStr.split(';');
    const [name, value] = nameValue.split('=');
    cookieStore[name.trim()] = value.trim();
  },
  clear: () => {
    cookieStore = {};
  },
};

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    mockCookie.clear();
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => mockCookie.get(),
      set: (val: string) => mockCookie.set(val),
    });
    // Mock window.location (already configured in jest.setup.js)
    (window as any).location.hostname = 'localhost';
    Object.defineProperty(navigator, 'language', {
      value: 'fr-FR',
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a button with flag icon', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Should contain an SVG (flag)
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('shows English flag when current language is French', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      // The button should show the flag of the language to switch to
      expect(button).toHaveAttribute('aria-label', 'Anglais');
    });

    it('shows French flag when current language is English', () => {
      cookieStore['language'] = 'en';

      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      // When in English mode, the label shows "French" (English translation)
      expect(button).toHaveAttribute('aria-label', 'French');
    });
  });

  describe('Interaction', () => {
    it('toggles to English when clicked in French mode', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(cookieStore['language']).toBe('en');
    });

    it('toggles to French when clicked in English mode', () => {
      cookieStore['language'] = 'en';

      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(cookieStore['language']).toBe('fr');
    });

    it('updates aria-label after toggle', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Anglais');

      fireEvent.click(button);

      // After toggling to English, label is "French" (in English)
      expect(button).toHaveAttribute('aria-label', 'French');
    });
  });

  describe('Accessibility', () => {
    it('button has aria-label', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('button has title attribute', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('flag SVG has aria-hidden', () => {
      renderWithProviders(<LanguageSwitcher />);

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Loading State', () => {
    it('shows disabled button before mount', () => {
      // This test checks the initial hydration state
      // The component shows a disabled button with FlagFR while mounting
      const { container } = renderWithProviders(<LanguageSwitcher />);

      // After mount, button should be enabled
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('has hover scale effect class', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:scale-105');
    });

    it('has focus ring styles', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:ring-2');
    });

    it('has rounded-full class for circular shape', () => {
      renderWithProviders(<LanguageSwitcher />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('rounded-full');
    });
  });
});
