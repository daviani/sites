import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/HeroSection';

vi.mock('@daviani/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.title': 'Daviani Fillatre',
        'home.subtitle': 'Développeur Full Stack',
        'home.description': 'Description du développeur',
      };
      return translations[key] || key;
    },
  }),
  OwlLogo: ({ size }: { size: number }) => (
    <svg data-testid="owl-logo" width={size} height={size} />
  ),
}));

describe('HeroSection', () => {
  it('renders the title', () => {
    render(<HeroSection />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Daviani Fillatre');
  });

  it('renders the subtitle', () => {
    render(<HeroSection />);

    expect(screen.getByText('Développeur Full Stack')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<HeroSection />);

    expect(screen.getByText('Description du développeur')).toBeInTheDocument();
  });

  it('renders the owl logo', () => {
    render(<HeroSection />);

    expect(screen.getByTestId('owl-logo')).toBeInTheDocument();
  });

  it('owl logo has correct size', () => {
    render(<HeroSection />);

    const logo = screen.getByTestId('owl-logo');
    expect(logo).toHaveAttribute('width', '120');
    expect(logo).toHaveAttribute('height', '120');
  });
});
