import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPageClient from '@/app/(site)/about/AboutPageClient';

vi.mock('@/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'pages.about.title': 'À propos',
        'pages.about.crossroad.title': 'Section Crossroad',
        'pages.about.crossroad.p1': 'Paragraph 1',
        'pages.about.crossroad.p2': 'Paragraph 2',
        'pages.about.crossroad.p3': 'Paragraph 3',
        'pages.about.building.title': 'Section Building',
        'pages.about.building.p1': 'Building p1',
        'pages.about.building.p2': 'Building p2',
        'pages.about.building.p3': 'Building p3',
        'pages.about.building.p4': 'Building p4',
        'pages.about.transmit.title': 'Section Transmit',
        'pages.about.transmit.p1': 'Transmit p1',
        'pages.about.transmit.p2': 'Transmit p2',
        'pages.about.breathe.title': 'Section Breathe',
        'pages.about.breathe.p1': 'Breathe p1',
        'pages.about.breathe.p2Start': 'Check out ',
        'pages.about.breathe.p2Link': 'photos',
        'pages.about.breathe.p2End': ' for more.',
        'pages.about.next.title': 'Section Next',
        'pages.about.next.p1': 'Next p1',
        'pages.about.cta.contact': 'Me contacter',
        'pages.about.cta.appointment': 'Prendre RDV',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@nordic-island/ui', () => ({
  Breadcrumb: ({ items }: { items: { href: string; label: string }[] }) => (
    <nav data-testid="breadcrumb">
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  ),
}));

describe('AboutPageClient', () => {
  it('renders page title', () => {
    render(<AboutPageClient />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('À propos');
  });

  it('renders breadcrumb', () => {
    render(<AboutPageClient />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders all sections', () => {
    render(<AboutPageClient />);

    expect(screen.getByText('Section Crossroad')).toBeInTheDocument();
    expect(screen.getByText('Section Building')).toBeInTheDocument();
    expect(screen.getByText('Section Transmit')).toBeInTheDocument();
    expect(screen.getByText('Section Breathe')).toBeInTheDocument();
    expect(screen.getByText('Section Next')).toBeInTheDocument();
  });

  it('renders contact CTA buttons', () => {
    render(<AboutPageClient />);

    expect(screen.getByText('Me contacter')).toBeInTheDocument();
    expect(screen.getByText('Prendre RDV')).toBeInTheDocument();
  });

  it('contact link points to /contact route', () => {
    render(<AboutPageClient />);

    const contactLink = screen.getByText('Me contacter').closest('a');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('RDV link points to /rdv route', () => {
    render(<AboutPageClient />);

    const rdvLink = screen.getByText('Prendre RDV').closest('a');
    expect(rdvLink).toHaveAttribute('href', '/rdv');
  });

  it('photos link points to /photos route', () => {
    render(<AboutPageClient />);

    const photosLink = screen.getByText('photos');
    expect(photosLink).toHaveAttribute('href', '/photos');
  });
});
