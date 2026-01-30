import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilter } from '@/components/photos/TagFilter';

vi.mock('@daviani/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'pages.photos.tags.all': 'Toutes',
      };
      return translations[key] || key;
    },
  }),
}));

describe('TagFilter', () => {
  const mockTags = ['mountain', 'nature', 'night'] as const;
  const mockOnTagChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the "all" button', () => {
    render(
      <TagFilter tags={[...mockTags]} activeTag={null} onTagChange={mockOnTagChange} />
    );

    expect(screen.getByText('Toutes')).toBeInTheDocument();
  });

  it('renders all tag buttons', () => {
    render(
      <TagFilter tags={[...mockTags]} activeTag={null} onTagChange={mockOnTagChange} />
    );

    expect(screen.getByText('mountain')).toBeInTheDocument();
    expect(screen.getByText('nature')).toBeInTheDocument();
    expect(screen.getByText('night')).toBeInTheDocument();
  });

  it('calls onTagChange with null when "all" button is clicked', () => {
    render(
      <TagFilter tags={[...mockTags]} activeTag="nature" onTagChange={mockOnTagChange} />
    );

    fireEvent.click(screen.getByText('Toutes'));
    expect(mockOnTagChange).toHaveBeenCalledWith(null);
  });

  it('calls onTagChange with tag when a tag button is clicked', () => {
    render(
      <TagFilter tags={[...mockTags]} activeTag={null} onTagChange={mockOnTagChange} />
    );

    fireEvent.click(screen.getByText('mountain'));
    expect(mockOnTagChange).toHaveBeenCalledWith('mountain');
  });

  it('highlights the active tag', () => {
    render(
      <TagFilter tags={[...mockTags]} activeTag="nature" onTagChange={mockOnTagChange} />
    );

    const activeButton = screen.getByText('nature');
    expect(activeButton).toHaveClass('bg-nord-3');
  });

  it('highlights "all" button when no tag is active', () => {
    render(
      <TagFilter tags={[...mockTags]} activeTag={null} onTagChange={mockOnTagChange} />
    );

    const allButton = screen.getByText('Toutes');
    expect(allButton).toHaveClass('bg-nord-3');
  });

  it('renders empty tag list', () => {
    render(<TagFilter tags={[]} activeTag={null} onTagChange={mockOnTagChange} />);

    expect(screen.getByText('Toutes')).toBeInTheDocument();
    // Only the "all" button should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });
});
