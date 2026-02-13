import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipLink } from '../../src/components/SkipLink';

describe('SkipLink', () => {
  it('renders a link element', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('links to #main-content', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('is visually hidden by default', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
  });

  it('becomes visible on focus', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:not-sr-only');
  });

  it('has focus styles', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:fixed');
    expect(link).toHaveClass('focus:z-[100]');
  });

  it('displays the label text', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Skip to content');
  });

  it('has high z-index when focused', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link.className).toContain('z-[100]');
  });

  it('has transition for smooth appearance', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('transition-all');
  });

  it('supports dark mode', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link.className).toContain('dark:');
  });

  it('has hover styles', () => {
    render(<SkipLink label="Skip to content" />);

    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:');
  });
});
