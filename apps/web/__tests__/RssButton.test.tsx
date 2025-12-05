import { render, screen } from './helpers/test-utils';
import { RssButton } from '@/components/blog/RssButton';

describe('RssButton', () => {
  it('renders the RSS subscribe button', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('links to the RSS feed', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/api/rss');
  });

  it('opens in a new tab', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays translated text', () => {
    render(<RssButton />);

    // Default language in tests is English: "Subscribe to RSS feed"
    expect(screen.getByText(/subscribe to rss feed/i)).toBeInTheDocument();
  });

  it('has accessible title attribute', () => {
    render(<RssButton />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title');
  });

  it('contains an RSS icon', () => {
    render(<RssButton />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});