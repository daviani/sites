import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';

// Mock state
const mockSetLanguage = vi.fn();
let mockLanguage = 'fr';
let mockMounted = true;

// Mock useLanguage hook
vi.mock('../../src/hooks/use-language', () => ({
  useLanguage: () => ({
    language: mockLanguage,
    setLanguage: mockSetLanguage,
    mounted: mockMounted,
  }),
  Language: {},
}));

// Mock useTranslation hook
vi.mock('../../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.english': 'English',
        'common.french': 'Français',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock FlagIcons
vi.mock('../../src/components/icons/FlagIcons', () => ({
  FlagFR: ({ size }: { size: number }) => (
    <svg data-testid="flag-fr" width={size} height={size} />
  ),
  FlagEN: ({ size }: { size: number }) => (
    <svg data-testid="flag-en" width={size} height={size} />
  ),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLanguage = 'fr';
    mockMounted = true;
  });

  describe('when mounted with French language', () => {
    it('renders the toggle button', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows English flag (switch to English)', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByTestId('flag-en')).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'English');
    });

    it('switches to English when clicked', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockSetLanguage).toHaveBeenCalledWith('en');
    });

    it('has title attribute matching aria-label', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'English');
    });

    it('has proper focus styles', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });
  });

  describe('when mounted with English language', () => {
    beforeEach(() => {
      mockLanguage = 'en';
    });

    it('shows French flag (switch to French)', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByTestId('flag-fr')).toBeInTheDocument();
    });

    it('has correct aria-label for English mode', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Français');
    });

    it('switches to French when clicked', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockSetLanguage).toHaveBeenCalledWith('fr');
    });

    it('has title attribute for English mode', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Français');
    });
  });

  describe('when not mounted (SSR)', () => {
    beforeEach(() => {
      mockMounted = false;
    });

    it('renders disabled placeholder button', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
    });

    it('shows French flag as placeholder', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByTestId('flag-fr')).toBeInTheDocument();
    });

    it('has loading aria-label', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Loading...');
    });
  });

  describe('accessibility', () => {
    it('button is keyboard accessible', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('has hover scale effect', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:scale-105');
    });
  });
});