/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConsentGate } from '../src';

// Mock ReCaptcha
const mockExecute = jest.fn();
jest.mock('../src/hooks/use-recaptcha', () => ({
  useRecaptcha: () => ({
    execute: mockExecute,
    isLoaded: true,
  }),
}));

// Mock translations
jest.mock('../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'rdv.showCalendar': 'Afficher le calendrier',
        'rdv.consent': 'En cliquant, vous acceptez le chargement du widget Calendly.',
        'rdv.loading': 'Chargement...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ConsentGate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue('fake-recaptcha-token');
  });

  it('renders the consent button initially', () => {
    render(
      <ConsentGate>
        <div data-testid="protected-content">Protected Content</div>
      </ConsentGate>
    );

    expect(screen.getByRole('button', { name: /afficher le calendrier/i })).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('displays consent message', () => {
    render(
      <ConsentGate>
        <div>Content</div>
      </ConsentGate>
    );

    expect(screen.getByText(/vous acceptez le chargement du widget Calendly/i)).toBeInTheDocument();
  });

  it('shows loading state when button is clicked', async () => {
    // Make execute take some time
    mockExecute.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('token'), 100)));

    render(
      <ConsentGate>
        <div data-testid="protected-content">Protected Content</div>
      </ConsentGate>
    );

    const button = screen.getByRole('button', { name: /afficher le calendrier/i });
    fireEvent.click(button);

    // Button should now show "Chargement..." and be disabled
    expect(screen.getByRole('button', { name: /chargement/i })).toBeDisabled();
  });

  it('shows children after successful ReCaptcha verification', async () => {
    render(
      <ConsentGate>
        <div data-testid="protected-content">Protected Content</div>
      </ConsentGate>
    );

    const button = screen.getByRole('button', { name: /afficher le calendrier/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /afficher le calendrier/i })).not.toBeInTheDocument();
  });

  it('calls ReCaptcha execute with correct action', async () => {
    render(
      <ConsentGate>
        <div>Content</div>
      </ConsentGate>
    );

    const button = screen.getByRole('button', { name: /afficher le calendrier/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith('show_calendly');
    });
  });

  it('stays in initial state if ReCaptcha fails', async () => {
    mockExecute.mockRejectedValue(new Error('ReCaptcha failed'));

    render(
      <ConsentGate>
        <div data-testid="protected-content">Protected Content</div>
      </ConsentGate>
    );

    const button = screen.getByRole('button', { name: /afficher le calendrier/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /afficher le calendrier/i })).toBeInTheDocument();
    });

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('accepts custom buttonText prop', () => {
    render(
      <ConsentGate buttonText="Custom Button">
        <div>Content</div>
      </ConsentGate>
    );

    expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument();
  });

  it('accepts custom consentText prop', () => {
    render(
      <ConsentGate consentText="Custom consent message">
        <div>Content</div>
      </ConsentGate>
    );

    expect(screen.getByText(/custom consent message/i)).toBeInTheDocument();
  });
});
