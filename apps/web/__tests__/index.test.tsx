import { render, screen } from './helpers/test-utils';
import RootPage from '@/app/page';
import { getSubdomainUrl } from '@/lib/domains/config';

describe('Homepage', () => {
  it('renders the main heading', () => {
    render(<RootPage />);
    const heading = screen.getByRole('heading', { name: /Daviani Fillatre/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<RootPage />);
    // Text can be in French or English depending on language
    const subtitle = screen.getByText(/Full-Stack.*DevOps|Développeur.*DevOps/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders navigation cards', () => {
    render(<RootPage />);
    expect(screen.getByRole('heading', { name: /Portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Blog/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument();
    // CV in French, Resume in English
    expect(screen.getByRole('heading', { name: /CV|Resume/i })).toBeInTheDocument();
  });

  it('has correct links for navigation cards', () => {
    render(<RootPage />);
    const portfolioLink = screen.getByRole('link', { name: /Portfolio/i });
    expect(portfolioLink).toHaveAttribute('href', getSubdomainUrl('portfolio'));
  });
});
