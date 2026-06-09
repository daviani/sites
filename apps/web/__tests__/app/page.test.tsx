import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/content/projects', () => ({
  getAllProjects: () => [{ slug: 'rodd', featured: true, links: [], hasDetail: true }],
  getAllContributions: () => [],
  STATUS_VARIANT: {},
}));
vi.mock('@/components/HeroSection', () => ({ HeroSection: () => <div data-testid="hero" /> }));
vi.mock('@/components/home/FeaturedProjects', () => ({
  FeaturedProjects: () => <div data-testid="featured" />,
}));
vi.mock('@/components/ExpertiseSection', () => ({ ExpertiseSection: () => <div data-testid="expertise" /> }));
vi.mock('@/components/home/ParcoursTeaser', () => ({ ParcoursTeaser: () => <div data-testid="parcours" /> }));
vi.mock('@/components/home/FinalCta', () => ({ FinalCta: () => <div data-testid="cta" /> }));

import HomePage from '@/app/(site)/page';

describe('HomePage', () => {
  it('composes the home sections', () => {
    render(<HomePage />);

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('featured')).toBeInTheDocument();
    expect(screen.getByTestId('expertise')).toBeInTheDocument();
    expect(screen.getByTestId('parcours')).toBeInTheDocument();
    expect(screen.getByTestId('cta')).toBeInTheDocument();
  });
});
