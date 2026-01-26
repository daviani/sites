import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-nord10');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-nord8');
  });

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('border-nord10');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-nord10');
    expect(button).not.toHaveClass('bg-nord10');
    expect(button).not.toHaveClass('border-2');
  });

  it('applies md size by default', () => {
    render(<Button>Medium</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('applies sm size', () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1.5');
  });

  it('applies lg size', () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('forwards additional props', () => {
    render(
      <Button type="submit" data-testid="custom-button">
        Submit
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-nord10'); // Still has default styles
  });

  it('has focus styles', () => {
    render(<Button>Focusable</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
  });

  it('has hover styles', () => {
    render(<Button>Hoverable</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-nord9');
  });
});