import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RssButton } from '@/components/blog/RssButton';

vi.mock('@daviani/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'rss.title': 'Flux RSS',
        'rss.subscribe': "S'abonner au RSS",
      };
      return translations[key] || key;
    },
  }),
}));

describe('RssButton', () => {
  it('renders RSS link', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/api/rss');
  });

  it('opens in new tab', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays translated text', () => {
    render(<RssButton />);

    expect(screen.getByText("S'abonner au RSS")).toBeInTheDocument();
  });

  it('has accessible title', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'Flux RSS');
  });

  it('contains RSS icon', () => {
    render(<RssButton />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
