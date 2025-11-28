import { render, screen } from '@testing-library/react';
import { FlagFR, FlagEN } from '../src/components/icons/FlagIcons';

describe('FlagFR', () => {
  it('renders an SVG element', () => {
    render(<FlagFR data-testid="flag-fr" />);
    const svg = screen.getByTestId('flag-fr');
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('has correct default size', () => {
    render(<FlagFR data-testid="flag-fr" />);
    const svg = screen.getByTestId('flag-fr');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('accepts custom size', () => {
    render(<FlagFR size={48} data-testid="flag-fr" />);
    const svg = screen.getByTestId('flag-fr');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('accepts custom className', () => {
    render(<FlagFR className="custom-class" data-testid="flag-fr" />);
    const svg = screen.getByTestId('flag-fr');
    expect(svg).toHaveClass('custom-class');
  });

  it('has aria-hidden by default for decorative use', () => {
    render(<FlagFR data-testid="flag-fr" />);
    const svg = screen.getByTestId('flag-fr');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('FlagEN', () => {
  it('renders an SVG element', () => {
    render(<FlagEN data-testid="flag-en" />);
    const svg = screen.getByTestId('flag-en');
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('has correct default size', () => {
    render(<FlagEN data-testid="flag-en" />);
    const svg = screen.getByTestId('flag-en');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('accepts custom size', () => {
    render(<FlagEN size={48} data-testid="flag-en" />);
    const svg = screen.getByTestId('flag-en');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('accepts custom className', () => {
    render(<FlagEN className="custom-class" data-testid="flag-en" />);
    const svg = screen.getByTestId('flag-en');
    expect(svg).toHaveClass('custom-class');
  });

  it('has aria-hidden by default for decorative use', () => {
    render(<FlagEN data-testid="flag-en" />);
    const svg = screen.getByTestId('flag-en');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
