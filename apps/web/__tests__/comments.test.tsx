import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Comments } from '@/components/blog/Comments';

// Mock Giscus component
jest.mock('@giscus/react', () => ({
  __esModule: true,
  default: () => <div data-testid="giscus-widget">Giscus Widget</div>,
}));

// Mock next/dynamic to load components synchronously in tests
jest.mock('next/dynamic', () => {
  return function dynamic(importFn: () => Promise<{ default: React.ComponentType }>) {
    const Component = require('@giscus/react').default;
    return Component;
  };
});

// Mock @daviani/ui hooks
jest.mock('@daviani/ui', () => ({
  useTheme: () => ({ theme: 'light', mounted: true }),
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'comments.title': 'Commentaires',
        'comments.consentText': 'Les commentaires sont gérés via GitHub.',
        'comments.privacyNote': 'Vos données seront traitées selon GitHub.',
        'comments.acceptButton': 'Accepter',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Comments Component', () => {
  it('displays consent block by default', () => {
    render(<Comments />);

    expect(screen.getByRole('heading', { name: /commentaires/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not display Giscus without consent', () => {
    render(<Comments />);

    expect(screen.queryByTestId('giscus-widget')).not.toBeInTheDocument();
  });

  it('displays Giscus after clicking accept button', () => {
    render(<Comments />);

    const acceptButton = screen.getByRole('button');
    fireEvent.click(acceptButton);

    expect(screen.getByTestId('giscus-widget')).toBeInTheDocument();
  });

  it('hides consent block after acceptance', () => {
    render(<Comments />);

    const acceptButton = screen.getByRole('button');
    fireEvent.click(acceptButton);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
