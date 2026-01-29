import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlagFR, FlagEN } from '../../src/components/icons/FlagIcons';

describe('FlagIcons', () => {
  describe('FlagFR', () => {
    it('renders an SVG element', () => {
      render(<FlagFR />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has default size of 24', () => {
      render(<FlagFR />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('accepts custom size prop', () => {
      render(<FlagFR size={48} />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('is hidden from screen readers', () => {
      render(<FlagFR />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('accepts custom className', () => {
      render(<FlagFR className="custom-class" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('passes through additional SVG props', () => {
      render(<FlagFR data-testid="french-flag" />);
      expect(screen.getByTestId('french-flag')).toBeInTheDocument();
    });

    it('contains the three French flag colors', () => {
      render(<FlagFR />);
      const svg = document.querySelector('svg');
      const innerHTML = svg?.innerHTML || '';
      // Blue, White, Red (Nord theme colors)
      expect(innerHTML).toContain('#5E81AC');
      expect(innerHTML).toContain('#ECEFF4');
      expect(innerHTML).toContain('#BF616A');
    });
  });

  describe('FlagEN', () => {
    it('renders an SVG element', () => {
      render(<FlagEN />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has default size of 24', () => {
      render(<FlagEN />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('accepts custom size prop', () => {
      render(<FlagEN size={32} />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('is hidden from screen readers', () => {
      render(<FlagEN />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('accepts custom className', () => {
      render(<FlagEN className="my-flag" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveClass('my-flag');
    });

    it('passes through additional SVG props', () => {
      render(<FlagEN data-testid="uk-flag" />);
      expect(screen.getByTestId('uk-flag')).toBeInTheDocument();
    });

    it('contains Union Jack colors', () => {
      render(<FlagEN />);
      const svg = document.querySelector('svg');
      const innerHTML = svg?.innerHTML || '';
      // Blue, White, Red (Nord theme colors)
      expect(innerHTML).toContain('#5E81AC');
      expect(innerHTML).toContain('#ECEFF4');
      expect(innerHTML).toContain('#BF616A');
    });
  });
});