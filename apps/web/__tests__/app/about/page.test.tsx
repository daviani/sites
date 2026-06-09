import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const translations: Record<string, string> = {
  'pages.about.title': 'À propos',
  'pages.about.lead.start': "J'ai commencé dans le ",
  'pages.about.lead.fire': 'métal',
  'pages.about.lead.end': ', pas dans le code.',
  'pages.about.crossroad.title': 'Section Crossroad',
  'pages.about.crossroad.p1': 'c1',
  'pages.about.crossroad.p2': 'c2',
  'pages.about.crossroad.p3': 'c3',
  'pages.about.building.title': 'Section Building',
  'pages.about.building.p1': 'b1',
  'pages.about.building.p2': 'b2',
  'pages.about.building.p3': 'b3',
  'pages.about.building.p4': 'b4',
  'pages.about.transmit.title': 'Section Transmit',
  'pages.about.transmit.p1': 't1',
  'pages.about.transmit.p2': 't2',
  'pages.about.breathe.title': 'Section Breathe',
  'pages.about.breathe.p1': 'br1',
  'pages.about.breathe.p2Start': 'Check ',
  'pages.about.breathe.p2Link': 'photos',
  'pages.about.breathe.p2End': '.',
  'pages.about.facts.location.k': 'Basé à',
  'pages.about.facts.location.v': 'Lyon',
  'pages.about.facts.location.sub': 'France',
  'pages.about.facts.since.k': 'Depuis',
  'pages.about.facts.since.v': '2017',
  'pages.about.facts.since.sub': 'reconversion',
  'pages.about.facts.field.k': 'Terrain',
  'pages.about.facts.field.v': 'Full-Stack & DevOps',
  'pages.about.facts.field.sub': 'front à infra',
  'pages.about.next.title': 'La suite',
  'pages.about.next.p1': 'next p1',
  'pages.about.cta.contact': 'Me contacter',
  'nav.about.title': 'À propos',
  'common.home': 'Accueil',
  'common.breadcrumb': "Fil d'Ariane",
};

vi.mock('@/lib/i18n/server', () => ({
  getServerTranslations: async () => ({ lang: 'fr', t: (k: string) => translations[k] ?? k }),
}));

vi.mock('@tulikettu/ui', () => ({
  Breadcrumb: ({ items }: { items: { href: string; label: string }[] }) => (
    <nav data-testid="breadcrumb">
      {items.map((i) => (
        <a key={i.href} href={i.href}>
          {i.label}
        </a>
      ))}
    </nav>
  ),
}));

import AboutPage from '@/app/(site)/about/page';

describe('AboutPage', () => {
  it('renders the title and breadcrumb', async () => {
    render(await AboutPage());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('À propos');
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders the four prose sections and the CTA block', async () => {
    render(await AboutPage());
    expect(screen.getByText('Section Crossroad')).toBeInTheDocument();
    expect(screen.getByText('Section Building')).toBeInTheDocument();
    expect(screen.getByText('Section Transmit')).toBeInTheDocument();
    expect(screen.getByText('Section Breathe')).toBeInTheDocument();
    expect(screen.getByText('La suite')).toBeInTheDocument();
  });

  it('highlights the lead keyword', async () => {
    render(await AboutPage());
    expect(screen.getByText('métal')).toBeInTheDocument();
  });

  it('renders the three facts', async () => {
    render(await AboutPage());
    expect(screen.getByText('Basé à')).toBeInTheDocument();
    expect(screen.getByText('Depuis')).toBeInTheDocument();
    expect(screen.getByText('Terrain')).toBeInTheDocument();
  });

  it('points the contact CTA to /contact', async () => {
    render(await AboutPage());
    expect(screen.getByText(/Me contacter/).closest('a')).toHaveAttribute('href', '/contact');
  });

  it('points the photos link to /photos', async () => {
    render(await AboutPage());
    expect(screen.getByText('photos')).toHaveAttribute('href', '/photos');
  });
});
