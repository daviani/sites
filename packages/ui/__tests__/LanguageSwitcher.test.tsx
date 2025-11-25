import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../src/components/LanguageSwitcher';
import { LanguageProvider } from '../src/hooks/use-language';
import { ReactNode } from 'react';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

const Wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

const renderWithProvider = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Wrapper });
};

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    Object.defineProperty(navigator, 'language', {
      value: 'fr-FR',
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders FR and EN buttons', () => {
      renderWithProvider(<LanguageSwitcher />);

      expect(screen.getByText('FR')).toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('renders separator between buttons', () => {
      renderWithProvider(<LanguageSwitcher />);

      expect(screen.getByText('/')).toBeInTheDocument();
    });

    it('renders with role group', () => {
      renderWithProvider(<LanguageSwitcher />);

      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('FR button is active when language is French', () => {
      renderWithProvider(<LanguageSwitcher />);

      const frButton = screen.getByText('FR');
      expect(frButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('EN button is not active when language is French', () => {
      renderWithProvider(<LanguageSwitcher />);

      const enButton = screen.getByText('EN');
      expect(enButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('EN button is active when language is English', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');

      renderWithProvider(<LanguageSwitcher />);

      const enButton = screen.getByText('EN');
      expect(enButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Interaction', () => {
    it('changes to English when EN button is clicked', () => {
      renderWithProvider(<LanguageSwitcher />);

      const enButton = screen.getByText('EN');
      fireEvent.click(enButton);

      expect(enButton).toHaveAttribute('aria-pressed', 'true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'en');
    });

    it('changes to French when FR button is clicked', () => {
      localStorageMock.getItem.mockReturnValueOnce('en');

      renderWithProvider(<LanguageSwitcher />);

      const frButton = screen.getByText('FR');
      fireEvent.click(frButton);

      expect(frButton).toHaveAttribute('aria-pressed', 'true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'fr');
    });

    it('clicking active button does not change state', () => {
      renderWithProvider(<LanguageSwitcher />);

      const frButton = screen.getByText('FR');
      fireEvent.click(frButton);

      expect(frButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has aria-label on group', () => {
      renderWithProvider(<LanguageSwitcher />);

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label');
    });

    it('FR button has French aria-label', () => {
      renderWithProvider(<LanguageSwitcher />);

      const frButton = screen.getByText('FR');
      expect(frButton).toHaveAttribute('aria-label', 'Français');
    });

    it('EN button has English aria-label', () => {
      renderWithProvider(<LanguageSwitcher />);

      const enButton = screen.getByText('EN');
      expect(enButton).toHaveAttribute('aria-label', 'Anglais');
    });

    it('buttons have aria-pressed attribute', () => {
      renderWithProvider(<LanguageSwitcher />);

      const frButton = screen.getByText('FR');
      const enButton = screen.getByText('EN');

      expect(frButton).toHaveAttribute('aria-pressed');
      expect(enButton).toHaveAttribute('aria-pressed');
    });
  });

  describe('Styling', () => {
    it('active button has active styling class', () => {
      renderWithProvider(<LanguageSwitcher />);

      const frButton = screen.getByText('FR');
      expect(frButton.className).toContain('bg-nord-10');
    });

    it('inactive button has inactive styling class', () => {
      renderWithProvider(<LanguageSwitcher />);

      const enButton = screen.getByText('EN');
      expect(enButton.className).toContain('text-nord-3');
    });
  });
});
