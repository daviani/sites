import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../../src/components/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant by default', () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-lg');
    expect(card).toHaveClass('hover:shadow-xl');
  });

  it('applies elevated variant', () => {
    render(
      <Card variant="elevated" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-xl');
    expect(card).toHaveClass('hover:shadow-2xl');
  });

  it('applies outlined variant', () => {
    render(
      <Card variant="outlined" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-2');
  });

  it('applies md padding by default', () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('p-6');
  });

  it('applies no padding when padding is none', () => {
    render(
      <Card padding="none" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).not.toHaveClass('p-4');
    expect(card).not.toHaveClass('p-6');
    expect(card).not.toHaveClass('p-8');
  });

  it('applies sm padding', () => {
    render(
      <Card padding="sm" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('p-4');
  });

  it('applies lg padding', () => {
    render(
      <Card padding="lg" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('p-8');
  });

  it('applies base styles', () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('rounded-[2.5rem]');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('backdrop-blur-md');
  });

  it('merges custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('rounded-[2.5rem]'); // Still has base styles
  });

  it('forwards additional props', () => {
    render(
      <Card data-testid="card" role="article" aria-label="Test card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'article');
    expect(card).toHaveAttribute('aria-label', 'Test card');
  });

  it('renders as a div element', () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
  });

  it('supports dark mode classes', () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId('card');
    expect(card.className).toContain('dark:');
  });
});