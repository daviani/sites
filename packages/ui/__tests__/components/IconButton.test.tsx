import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from '../../src/components/IconButton';

describe('IconButton', () => {
  it('renders children', () => {
    render(
      <IconButton aria-label="Test">
        <svg data-testid="icon" />
      </IconButton>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies base styles', () => {
    render(
      <IconButton aria-label="Test" data-testid="btn">
        <span />
      </IconButton>
    );

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('p-2');
    expect(btn).toHaveClass('rounded-full');
    expect(btn).toHaveClass('transition-all');
    expect(btn).toHaveClass('cursor-pointer');
  });

  it('applies interactive styles when enabled', () => {
    render(
      <IconButton aria-label="Test" data-testid="btn">
        <span />
      </IconButton>
    );

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('hover:scale-105');
    expect(btn).toHaveClass('hover:bg-nord-5');
  });

  it('applies disabled styles when disabled', () => {
    render(
      <IconButton aria-label="Test" data-testid="btn" disabled>
        <span />
      </IconButton>
    );

    const btn = screen.getByTestId('btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('opacity-50');
    expect(btn).not.toHaveClass('hover:scale-105');
  });

  it('merges custom className', () => {
    render(
      <IconButton aria-label="Test" data-testid="btn" className="text-red-500">
        <span />
      </IconButton>
    );

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('text-red-500');
    expect(btn).toHaveClass('rounded-full');
  });

  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Test" onClick={onClick}>
        <span />
      </IconButton>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards aria-label and title props', () => {
    render(
      <IconButton aria-label="Toggle theme" title="Toggle theme">
        <span />
      </IconButton>
    );

    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'Toggle theme');
    expect(btn).toHaveAttribute('title', 'Toggle theme');
  });

  it('has proper focus styles for accessibility', () => {
    render(
      <IconButton aria-label="Test" data-testid="btn">
        <span />
      </IconButton>
    );

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('focus:outline-none');
    expect(btn).toHaveClass('focus:ring-2');
    expect(btn).toHaveClass('focus:ring-nord-10');
  });

  it('is keyboard accessible', () => {
    render(
      <IconButton aria-label="Test">
        <span />
      </IconButton>
    );

    const btn = screen.getByRole('button');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });
});
