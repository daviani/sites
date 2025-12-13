import { render, screen } from './helpers/test-utils';
import AboutPage from '@/app/about/page';

// Mock getSubdomainUrl to return predictable URLs in tests
jest.mock('@/lib/domains/config', () => ({
  ...jest.requireActual('@/lib/domains/config'),
  getSubdomainUrl: (subdomain: string) => `/${subdomain}`,
}));

describe('About Page', () => {
  it('renders the main heading', () => {
    render(<AboutPage />);
    const heading = screen.getByRole('heading', { name: /À propos|About/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders crossroad section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Un chemin de traverse|A different path/i })).toBeInTheDocument();
  });

  it('renders building section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Construire autrement|Building differently/i })).toBeInTheDocument();
  });

  it('renders transmit section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Transmettre|Giving back/i })).toBeInTheDocument();
  });

  it('renders breathe section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Respirer|Breathe/i })).toBeInTheDocument();
  });

  it('renders next section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /La suite|What's next/i })).toBeInTheDocument();
  });

  it('renders contact CTA button', () => {
    render(<AboutPage />);
    expect(screen.getByRole('link', { name: /Me contacter|Contact me/i })).toBeInTheDocument();
  });

  it('renders appointment CTA button', () => {
    render(<AboutPage />);
    expect(screen.getByRole('link', { name: /Prendre rendez-vous|Book an appointment/i })).toBeInTheDocument();
  });

  it('renders photos link in breathe section', () => {
    render(<AboutPage />);
    const photosLink = screen.getByRole('link', { name: /quelques-unes|a few of them/i });
    expect(photosLink).toBeInTheDocument();
    expect(photosLink).toHaveAttribute('href', '/photos');
  });
});