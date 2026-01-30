import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoCard } from '@/components/photos/PhotoCard';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="photo-image" {...props} />
  ),
}));

describe('PhotoCard', () => {
  const mockPhoto = {
    id: 'test-photo',
    src: '/photos/test.webp',
    alt: 'Test photo alt text',
    title: 'Test Photo Title',
    width: 1920,
    height: 1080,
    tags: ['nature', 'mountain'],
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the photo image', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);

    const image = screen.getByTestId('photo-image');
    expect(image).toHaveAttribute('src', '/photos/test.webp');
    expect(image).toHaveAttribute('alt', 'Test photo alt text');
  });

  it('renders the photo title', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);

    expect(screen.getByText('Test Photo Title')).toBeInTheDocument();
  });

  it('renders all tags', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);

    expect(screen.getByText('nature')).toBeInTheDocument();
    expect(screen.getByText('mountain')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has accessible aria-label', () => {
    render(<PhotoCard photo={mockPhoto} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Test photo alt text');
  });

  it('renders photo without tags', () => {
    const photoNoTags = { ...mockPhoto, tags: [] };
    render(<PhotoCard photo={photoNoTags} onClick={mockOnClick} />);

    expect(screen.getByText('Test Photo Title')).toBeInTheDocument();
    expect(screen.queryByText('nature')).not.toBeInTheDocument();
  });
});
