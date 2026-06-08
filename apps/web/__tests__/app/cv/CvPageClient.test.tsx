import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CvPageClient from '@/app/(site)/cv/CvPageClient';

// Thème mockable dynamiquement (hoisted pour être accessible dans la factory de vi.mock).
const { themeState } = vi.hoisted(() => ({
  themeState: { current: { theme: 'light' as 'light' | 'dark', mounted: true } },
}));

vi.mock('@tulikettu/ui', () => ({
  useTheme: () => themeState.current,
  Breadcrumb: () => null,
}));

vi.mock('@/hooks/use-translation', () => ({
  // renvoie la clé telle quelle → on peut asserter sur les clés
  useTranslation: () => ({ t: (key: string) => key }),
}));

const LIGHT_PDF = '/cv/Daviani-Fillatre-CV-light.pdf';
const DARK_PDF = '/cv/Daviani-Fillatre-CV.pdf';

function downloadLinkByText(text: string): HTMLAnchorElement {
  return screen.getByText(text).closest('a') as HTMLAnchorElement;
}

describe('CvPageClient', () => {
  it('renders title and subtitle', () => {
    themeState.current = { theme: 'light', mounted: true };
    render(<CvPageClient />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('cv.title');
    expect(screen.getByText('cv.subtitle')).toBeInTheDocument();
  });

  it('light theme: primary downloads light CV, secondary offers the dark version', () => {
    themeState.current = { theme: 'light', mounted: true };
    render(<CvPageClient />);
    expect(downloadLinkByText('cv.download')).toHaveAttribute('href', LIGHT_PDF);
    expect(downloadLinkByText('cv.downloadDark')).toHaveAttribute('href', DARK_PDF);
  });

  it('dark theme: primary downloads dark CV, secondary offers the light version', () => {
    themeState.current = { theme: 'dark', mounted: true };
    render(<CvPageClient />);
    expect(downloadLinkByText('cv.download')).toHaveAttribute('href', DARK_PDF);
    expect(downloadLinkByText('cv.downloadLight')).toHaveAttribute('href', LIGHT_PDF);
  });

  it('renders the two CV page images of the current theme', () => {
    themeState.current = { theme: 'dark', mounted: true };
    render(<CvPageClient />);
    const cvImages = screen
      .getAllByRole('img')
      .filter((img) => (img.getAttribute('src') ?? '').includes('/cv/cv-'));
    expect(cvImages).toHaveLength(2);
    expect(cvImages[0]).toHaveAttribute('src', '/cv/cv-dark-1.webp');
    expect(cvImages[1]).toHaveAttribute('src', '/cv/cv-dark-2.webp');
  });

  it('not mounted: falls back to the light version (SSR default)', () => {
    themeState.current = { theme: 'dark', mounted: false };
    render(<CvPageClient />);
    expect(downloadLinkByText('cv.download')).toHaveAttribute('href', LIGHT_PDF);
  });
});
