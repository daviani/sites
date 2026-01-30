import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CalendlyEmbed } from '../../src/components/CalendlyEmbed';

describe('CalendlyEmbed', () => {
  const defaultUrl = 'https://calendly.com/test-user/30min';

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.Calendly
    (window as Record<string, unknown>).Calendly = undefined;
    // Clean up any scripts added to head
    document.head.querySelectorAll('script').forEach((s) => s.remove());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the calendly container', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      expect(screen.getByTestId('calendly-widget')).toBeInTheDocument();
    });

    it('sets default height to 700px', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      expect(container.style.minHeight).toBe('700px');
    });

    it('uses custom height when provided', () => {
      render(<CalendlyEmbed url={defaultUrl} height={500} />);
      const container = screen.getByTestId('calendly-widget');
      expect(container.style.minHeight).toBe('500px');
    });

    it('sets width to 100%', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      expect(container.style.width).toBe('100%');
    });

    it('sets overflow hidden', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      expect(container.style.overflow).toBe('hidden');
    });

    it('has calendly-inline-widget class', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      expect(container).toHaveClass('calendly-inline-widget');
    });
  });

  describe('URL enhancement', () => {
    it('adds hide_gdpr_banner param by default', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      const dataUrl = container.getAttribute('data-url');
      expect(dataUrl).toContain('hide_gdpr_banner=1');
    });

    it('does not add hide_gdpr_banner when disabled', () => {
      render(<CalendlyEmbed url={defaultUrl} hideGdprBanner={false} />);
      const container = screen.getByTestId('calendly-widget');
      const dataUrl = container.getAttribute('data-url');
      expect(dataUrl).not.toContain('hide_gdpr_banner=1');
    });

    it('adds embed_type=Inline param', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      const dataUrl = container.getAttribute('data-url');
      expect(dataUrl).toContain('embed_type=Inline');
    });

    it('adds embed_domain=1 param', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const container = screen.getByTestId('calendly-widget');
      const dataUrl = container.getAttribute('data-url');
      expect(dataUrl).toContain('embed_domain=1');
    });

    it('falls back to raw URL on invalid URL', () => {
      render(<CalendlyEmbed url="not-a-valid-url" />);
      const container = screen.getByTestId('calendly-widget');
      expect(container.getAttribute('data-url')).toBe('not-a-valid-url');
    });
  });

  describe('script loading', () => {
    it('appends Calendly script to head when not already loaded', () => {
      render(<CalendlyEmbed url={defaultUrl} />);
      const script = document.head.querySelector('script[src*="calendly"]');
      expect(script).not.toBeNull();
      expect(script?.getAttribute('src')).toContain('assets.calendly.com');
    });

    it('does not append script if window.Calendly exists', () => {
      (window as Record<string, unknown>).Calendly = {
        initInlineWidget: vi.fn(),
      };

      render(<CalendlyEmbed url={defaultUrl} />);
      const scripts = document.head.querySelectorAll('script[src*="calendly"]');
      expect(scripts.length).toBe(0);
    });

    it('calls initInlineWidget when Calendly is already loaded', async () => {
      const mockInit = vi.fn();
      (window as Record<string, unknown>).Calendly = {
        initInlineWidget: mockInit,
      };

      render(<CalendlyEmbed url={defaultUrl} />);

      // Wait for effects
      await vi.waitFor(() => {
        expect(mockInit).toHaveBeenCalledWith(
          expect.objectContaining({
            parentElement: expect.any(HTMLElement),
          })
        );
      });
    });
  });

  describe('height auto-resize', () => {
    it('updates height on calendly.page_height message', () => {
      render(<CalendlyEmbed url={defaultUrl} />);

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { event: 'calendly.page_height', payload: { height: 900 } },
          })
        );
      });

      const container = screen.getByTestId('calendly-widget');
      expect(container.style.minHeight).toBe('900px');
    });

    it('ignores unrelated messages', () => {
      render(<CalendlyEmbed url={defaultUrl} />);

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { event: 'other-event' },
          })
        );
      });

      const container = screen.getByTestId('calendly-widget');
      expect(container.style.minHeight).toBe('700px');
    });
  });
});
