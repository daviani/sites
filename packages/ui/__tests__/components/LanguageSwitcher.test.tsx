import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';

// Mock FlagIcons
vi.mock('../../src/components/icons/FlagIcons', () => ({
  FlagFR: ({ size }: { size: number }) => (
    <svg data-testid="flag-fr" width={size} height={size} />
  ),
  FlagEN: ({ size }: { size: number }) => (
    <svg data-testid="flag-en" width={size} height={size} />
  ),
}));

const defaultLabels = {
  switchToEnglish: 'English',
  switchToFrench: 'Français',
};

describe('LanguageSwitcher', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when mounted with French language', () => {
    it('renders the toggle button', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows English flag (switch to English)', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      expect(screen.getByTestId('flag-en')).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'English');
    });

    it('calls onToggle when clicked', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('has title attribute matching aria-label', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'English');
    });

    it('has proper focus styles', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });
  });

  describe('when mounted with English language', () => {
    it('shows French flag (switch to French)', () => {
      render(
        <LanguageSwitcher language="en" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      expect(screen.getByTestId('flag-fr')).toBeInTheDocument();
    });

    it('has correct aria-label for English mode', () => {
      render(
        <LanguageSwitcher language="en" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Français');
    });

    it('calls onToggle when clicked', () => {
      render(
        <LanguageSwitcher language="en" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('has title attribute for English mode', () => {
      render(
        <LanguageSwitcher language="en" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Français');
    });
  });

  describe('when not mounted (SSR)', () => {
    it('renders disabled placeholder button', () => {
      render(
        <LanguageSwitcher language="fr" mounted={false} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
    });

    it('shows French flag as placeholder', () => {
      render(
        <LanguageSwitcher language="fr" mounted={false} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      expect(screen.getByTestId('flag-fr')).toBeInTheDocument();
    });

    it('has loading aria-label', () => {
      render(
        <LanguageSwitcher language="fr" mounted={false} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Loading...');
    });
  });

  describe('accessibility', () => {
    it('button is keyboard accessible', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('has hover scale effect', () => {
      render(
        <LanguageSwitcher language="fr" mounted={true} onToggle={mockOnToggle} labels={defaultLabels} />
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:scale-105');
    });
  });
});
