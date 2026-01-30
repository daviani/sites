import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePageClient from '@/app/(site)/HomePageClient';

vi.mock('@/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
}));

describe('HomePageClient', () => {
  it('renders HeroSection component', () => {
    render(<HomePageClient />);

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('has centered layout', () => {
    const { container } = render(<HomePageClient />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('justify-center');
  });
});
