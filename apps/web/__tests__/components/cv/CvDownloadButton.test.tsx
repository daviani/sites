import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CvDownloadButton } from '@/components/cv/CvDownloadButton';

const mockTranslation = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'pages.cv.labels.download': 'Télécharger le CV',
    };
    return translations[key] || key;
  },
  language: 'fr',
};

vi.mock('@nordic-island/ui', () => ({
  useTranslation: () => mockTranslation,
}));

describe('CvDownloadButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders download button', () => {
    render(<CvDownloadButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Télécharger le CV');
  });

  it('shows download icon initially', () => {
    render(<CvDownloadButton />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveClass('animate-spin');
  });

  it('shows loading spinner when downloading', async () => {
    const mockFetch = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', mockFetch);

    render(<CvDownloadButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const svg = document.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });
  });

  it('disables button during download', async () => {
    const mockFetch = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', mockFetch);

    render(<CvDownloadButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('calls fetch with correct parameters', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      })
    );
    vi.stubGlobal('fetch', mockFetch);

    // Mock URL methods
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn(),
    });

    render(<CvDownloadButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/cv/pdf?')
      );
    });
  });

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );
    vi.stubGlobal('fetch', mockFetch);

    render(<CvDownloadButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    // Button should be re-enabled after error
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    consoleSpy.mockRestore();
  });
});
