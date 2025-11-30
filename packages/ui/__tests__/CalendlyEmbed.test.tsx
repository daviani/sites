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

  it('sets the correct data-url attribute', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveAttribute('data-url', defaultUrl);
  });

  it('applies custom height when provided', () => {
    render(<CalendlyEmbed url={defaultUrl} height={800} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveStyle({ height: '800px' });
  });

  it('uses default height of 700px when not provided', () => {
    render(<CalendlyEmbed url={defaultUrl} />);

    const widget = screen.getByTestId('calendly-widget');
    expect(widget).toHaveStyle({ height: '700px' });
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
});
