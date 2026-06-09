import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from '../../src/components/Tag';

describe('Tag', () => {
  it('renders its children', () => {
    render(<Tag>typescript</Tag>);
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('applies the base chip classes (tokens only)', () => {
    render(<Tag>node</Tag>);
    const el = screen.getByText('node');
    expect(el).toHaveClass('font-mono');
    expect(el).toHaveClass('bg-surface-el');
    expect(el).toHaveClass('rounded-lg');
  });

  it('merges an extra className', () => {
    render(<Tag className="mt-2">react</Tag>);
    const el = screen.getByText('react');
    expect(el).toHaveClass('mt-2');
    expect(el).toHaveClass('font-mono');
  });
});
