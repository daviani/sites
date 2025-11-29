import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from '../src/components/DarkModeToggle';

// Mock useTheme hook
const mockToggleTheme = jest.fn();
let mockTheme = 'light';
let mockMounted = true;

jest.mock('../src/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
    mounted: mockMounted,
  }),
}));

// Mock useTranslation hook
jest.mock('../src/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'darkMode.switchToDark': 'Switch to dark mode',
        'darkMode.switchToLight': 'Switch to light mode',
      };
      return translations[key] || key;
    },
    language: 'en',
    mounted: true,
  }),
}));

describe('DarkModeToggle Component', () => {
  beforeEach(() => {
    mockTheme = 'light';
    mockMounted = true;
    mockToggleTheme.mockClear();
  });

  describe('Rendering', () => {
    it('renders a button element', () => {
      render(<DarkModeToggle />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders moon icon in light mode', () => {
      mockTheme = 'light';
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('renders sun icon in dark mode', () => {
      mockTheme = 'dark';
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });
  });

  describe('Hydration Safety', () => {
    it('renders disabled placeholder when not mounted', () => {
      mockMounted = false;
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('renders enabled button when mounted', () => {
      mockMounted = true;
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('calls toggleTheme when clicked', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('does not call toggleTheme when disabled (not mounted)', () => {
      mockMounted = false;
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockToggleTheme).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('p-2');
      expect(button.className).toContain('rounded-full');
      expect(button.className).toContain('transition-all');
    });

    it('applies Nord theme colors', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-nord-3');
      expect(button.className).toContain('hover:bg-nord-5');
    });

    it('applies dark mode classes', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('dark:text-nord-8');
      expect(button.className).toContain('dark:hover:bg-nord-2');
    });
  });

  describe('Accessibility', () => {
    it('has descriptive aria-label for light mode', () => {
      mockTheme = 'light';
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('has descriptive aria-label for dark mode', () => {
      mockTheme = 'dark';
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('is keyboard accessible', () => {
      render(<DarkModeToggle />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
