import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('bg-nord10');
    });

    it('renders secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('bg-nord8');
    });

    it('renders outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-nord10');
    });

    it('renders ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('text-nord10');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      const { container } = render(<Button>Medium</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
    });

    it('renders small size', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
    });

    it('renders large size', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
    });
  });

  describe('Props', () => {
    it('accepts custom className', () => {
      const { container } = render(<Button className="custom-class">Custom</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('custom-class');
    });

    it('passes through native button props', () => {
      render(<Button disabled data-testid="test-button">Disabled</Button>);
      const button = screen.getByTestId('test-button');
      expect(button).toBeDisabled();
    });

    it('handles onClick events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      screen.getByText('Click').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
