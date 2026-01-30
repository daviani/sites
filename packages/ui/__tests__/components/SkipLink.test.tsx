import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipLink } from '../../src/components/SkipLink';
import { LanguageProvider } from '../../src/hooks/use-language';
import type { ReactNode } from 'react';

// Mock getCookieDomain
vi.mock('../../src/utils/cookies', () => ({
  getCookieDomain: vi.fn(() => null),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('SkipLink', () => {
  it('renders a link element', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('links to #main-content', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('is visually hidden by default', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
  });

  it('becomes visible on focus', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:not-sr-only');
  });

  it('has focus styles', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:fixed');
    expect(link).toHaveClass('focus:z-[100]');
  });

  it('has accessible text content', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    // Should have some text content from translation
    expect(link.textContent).toBeTruthy();
  });

  it('has high z-index when focused', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link.className).toContain('z-[100]');
  });

  it('has transition for smooth appearance', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveClass('transition-all');
  });

  it('supports dark mode', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link.className).toContain('dark:');
  });

  it('has hover styles', () => {
    render(<SkipLink />, { wrapper });

    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:');
  });
});