import { render, screen } from './helpers/test-utils';
import RootPage from '@/app/(site)/page';

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

  it('renders the description', () => {
    render(<RootPage />);
    // Text can be in French or English depending on language
    const description = screen.getByText(/From code to deployment|Du code au déploiement/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the OwlLogo', () => {
    const { container } = render(<RootPage />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
