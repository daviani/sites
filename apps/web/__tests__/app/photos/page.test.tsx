import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhotosPage from '@/app/(site)/photos/page';

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

vi.mock('@/components/photos', () => ({
  PhotosPageContent: ({ photos, tags }: { photos: unknown[]; tags: string[] }) => (
    <div data-testid="photos-content">
      <span data-testid="photo-count">{photos.length}</span>
      <span data-testid="tag-count">{tags.length}</span>
    </div>
  ),
}));

vi.mock('@/lib/content/photos', () => ({
  getAllPhotos: () => [
    { id: '1', tags: ['nature', 'mountain'] },
    { id: '2', tags: ['mountain', 'night'] },
    { id: '3', tags: ['nature'] },
  ],
}));

describe('PhotosPage', () => {
  it('renders breadcrumb', () => {
    render(<PhotosPage />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders PhotosPageContent', () => {
    render(<PhotosPage />);

    expect(screen.getByTestId('photos-content')).toBeInTheDocument();
  });

  it('passes photos to PhotosPageContent', () => {
    render(<PhotosPage />);

    expect(screen.getByTestId('photo-count')).toHaveTextContent('3');
  });

  it('extracts unique tags from photos', () => {
    render(<PhotosPage />);

    // Tags: nature, mountain, night = 3 unique tags
    expect(screen.getByTestId('tag-count')).toHaveTextContent('3');
  });
});
