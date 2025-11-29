import { render, screen } from '@testing-library/react';
import { Card } from '../src/components/Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('renders default variant by default', () => {
      const { container } = render(<Card>Default</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('shadow-lg');
      expect(card.className).toContain('bg-white/40');
    });

    it('renders elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('shadow-xl');
    });

    it('renders outlined variant', () => {
      const { container } = render(<Card variant="outlined">Outlined</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('border-2');
      expect(card.className).toContain('border-nord-4');
    });
  });

  describe('Padding', () => {
    it('renders medium padding by default', () => {
      const { container } = render(<Card>Medium</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('p-6');
    });

    it('renders no padding', () => {
      const { container } = render(<Card padding="none">None</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toContain('p-4');
      expect(card.className).not.toContain('p-6');
      expect(card.className).not.toContain('p-8');
    });

    it('renders small padding', () => {
      const { container } = render(<Card padding="sm">Small</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('p-4');
    });

    it('renders large padding', () => {
      const { container } = render(<Card padding="lg">Large</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('p-8');
    });
  });

  describe('Props', () => {
    it('accepts custom className', () => {
      const { container } = render(<Card className="custom-class">Custom</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-class');
    });

    it('passes through native div props', () => {
      render(<Card data-testid="test-card" aria-label="Test">Content</Card>);
      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('aria-label', 'Test');
    });

    it('handles onClick events', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick} data-testid="clickable-card">Click</Card>);
      screen.getByTestId('clickable-card').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('applies transition-all class', () => {
      const { container } = render(<Card>Transition</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('transition-all');
    });

    it('applies rounded-[2.5rem] class', () => {
      const { container } = render(<Card>Rounded</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('rounded-[2.5rem]');
    });

    it('applies backdrop-blur-md class', () => {
      const { container } = render(<Card>Blur</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('backdrop-blur-md');
    });
  });
});
