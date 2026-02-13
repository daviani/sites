import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConsentGate } from '../../components/ConsentGate';

// Mock hooks
const mockExecute = vi.fn();
vi.mock('@/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'rdv.consent': 'Veuillez accepter pour afficher le calendrier',
        'rdv.showCalendar': 'Afficher le calendrier',
        'rdv.loading': 'Chargement...',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@nordic-island/ui', () => ({
  useRecaptcha: () => ({
    execute: mockExecute,
  }),
}));

describe('ConsentGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue('mock-token');
  });

  describe('initial state', () => {
    it('renders consent message', () => {
      render(
        <ConsentGate>
          <div>Protected Content</div>
        </ConsentGate>
      );

      expect(screen.getByText('Veuillez accepter pour afficher le calendrier')).toBeInTheDocument();
    });

    it('renders consent button', () => {
      render(
        <ConsentGate>
          <div>Protected Content</div>
        </ConsentGate>
      );

      expect(screen.getByRole('button', { name: 'Afficher le calendrier' })).toBeInTheDocument();
    });

    it('does not render children initially', () => {
      render(
        <ConsentGate>
          <div data-testid="protected">Protected Content</div>
        </ConsentGate>
      );

      expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });
  });

  describe('custom props', () => {
    it('uses custom button text', () => {
      render(
        <ConsentGate buttonText="Accept">
          <div>Content</div>
        </ConsentGate>
      );

      expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    });

    it('uses custom consent text', () => {
      render(
        <ConsentGate consentText="Please accept cookies">
          <div>Content</div>
        </ConsentGate>
      );

      expect(screen.getByText('Please accept cookies')).toBeInTheDocument();
    });
  });

  describe('verification flow', () => {
    it('shows loading state when clicked', async () => {
      mockExecute.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('token'), 100))
      );

      render(
        <ConsentGate>
          <div>Content</div>
        </ConsentGate>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('button', { name: 'Chargement...' })).toBeDisabled();
    });

    it('reveals children after successful verification', async () => {
      render(
        <ConsentGate>
          <div data-testid="protected">Protected Content</div>
        </ConsentGate>
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByTestId('protected')).toBeInTheDocument();
      });
    });

    it('calls execute with correct action', async () => {
      render(
        <ConsentGate action="custom_action">
          <div>Content</div>
        </ConsentGate>
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith('custom_action');
      });
    });

    it('uses default action show_calendly', async () => {
      render(
        <ConsentGate>
          <div>Content</div>
        </ConsentGate>
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith('show_calendly');
      });
    });
  });

  describe('error handling', () => {
    it('stays in consent state on verification failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockExecute.mockRejectedValue(new Error('Verification failed'));

      render(
        <ConsentGate>
          <div data-testid="protected">Content</div>
        </ConsentGate>
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Afficher le calendrier' })).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('re-enables button after failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockExecute.mockRejectedValue(new Error('Verification failed'));

      render(
        <ConsentGate>
          <div>Content</div>
        </ConsentGate>
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('accessibility', () => {
    it('button has focus styles', () => {
      render(
        <ConsentGate>
          <div>Content</div>
        </ConsentGate>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-4');
    });

    it('consent message is centered', () => {
      render(
        <ConsentGate>
          <div>Content</div>
        </ConsentGate>
      );

      const message = screen.getByText('Veuillez accepter pour afficher le calendrier');
      expect(message).toHaveClass('text-center');
    });
  });
});