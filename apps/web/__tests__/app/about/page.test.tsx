import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/(site)/about/page';

vi.mock('@/app/(site)/about/AboutPageClient', () => ({
  default: () => <div data-testid="about-page-client">About Page Content</div>,
}));

describe('AboutPage', () => {
  it('renders AboutPageClient component', () => {
    render(<AboutPage />);

    expect(screen.getByTestId('about-page-client')).toBeInTheDocument();
  });
});
