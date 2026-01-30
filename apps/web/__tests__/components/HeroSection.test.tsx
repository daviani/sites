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
        'home.cta.contact': 'Me contacter',
        'home.cta.cv': 'Voir mon CV',
      };
      return translations[key] || key;
    },
  }),
  OwlLogo: ({ size }: { size: number }) => (
    <svg data-testid="owl-logo" width={size} height={size} />
  ),
}));

vi.mock('@/lib/domains/config', () => ({
  getSubdomainUrl: (subdomain: string) => `https://${subdomain}.daviani.dev`,
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

  it('renders contact CTA button', () => {
    render(<HeroSection />);

    const contactLink = screen.getByRole('link', { name: 'Me contacter' });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', 'https://contact.daviani.dev');
  });

  it('renders CV CTA button', () => {
    render(<HeroSection />);

    const cvLink = screen.getByRole('link', { name: 'Voir mon CV' });
    expect(cvLink).toBeInTheDocument();
    expect(cvLink).toHaveAttribute('href', 'https://cv.daviani.dev');
  });
});
