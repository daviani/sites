import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(site)/page';

vi.mock('@/app/(site)/HomePageClient', () => ({
  default: () => <div data-testid="home-page-client">Home Page Client</div>,
}));

describe('HomePage', () => {
  it('renders HomePageClient component', () => {
    render(<HomePage />);

    expect(screen.getByTestId('home-page-client')).toBeInTheDocument();
  });
});
