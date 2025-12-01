/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { CalendlyEmbed } from '../src/components/CalendlyEmbed';

describe('CalendlyEmbed', () => {
  const defaultUrl = 'https://calendly.com/test-user/30min';

  it('renders the Calendly widget container', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toBeInTheDocument();
  });

  it('sets the correct data-url attribute with enhanced params', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    const dataUrl = widget.getAttribute('data-url');

    expect(dataUrl).toContain(defaultUrl);
    expect(dataUrl).toContain('hide_gdpr_banner=1');
    expect(dataUrl).toContain('embed_type=Inline');
  });

  it('applies custom minHeight when provided', () => {
    render(<CalendlyEmbed url={defaultUrl} height={800} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveStyle({ minHeight: '800px' });
  });

  it('uses default minHeight of 700px when not provided', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveStyle({ minHeight: '700px' });
  });

  it('has correct CSS class for styling', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveClass('calendly-inline-widget');
  });

  it('renders with full width', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveStyle({ width: '100%' });
  });

  it('has data-resize attribute for auto-resize', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveAttribute('data-resize', 'true');
  });

  it('does not add hide_gdpr_banner when hideGdprBanner is false', () => {
    render(<CalendlyEmbed url={defaultUrl} hideGdprBanner={false} />);

    const widget = screen.getByTestId('calendly-widget');
    const dataUrl = widget.getAttribute('data-url');

    expect(dataUrl).not.toContain('hide_gdpr_banner');
  });
});
