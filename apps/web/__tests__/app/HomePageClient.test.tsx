import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePageClient from '@/app/(site)/HomePageClient';

vi.mock('@/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock('@/components/ExpertiseSection', () => ({
  ExpertiseSection: () => <div data-testid="expertise-section">Expertise Section</div>,
}));

describe('HomePageClient', () => {
  it('renders HeroSection component', () => {
    render(<HomePageClient />);

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('renders ExpertiseSection component', () => {
    render(<HomePageClient />);

    expect(screen.getByTestId('expertise-section')).toBeInTheDocument();
  });

  it('has proper layout classes', () => {
    const { container } = render(<HomePageClient />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('py-12');
  });
});
