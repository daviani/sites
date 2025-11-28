import { render, screen } from './helpers/test-utils';
import PortfolioPage from '@/app/portfolio/page';

describe('Portfolio Page', () => {
  it('renders the main heading', () => {
    render(<PortfolioPage />);
    const heading = screen.getByRole('heading', { name: /Daviani Fillatre/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders skills section', () => {
    render(<PortfolioPage />);
    // Skills heading can be "Compétences" (FR) or "Skills" (EN)
    expect(screen.getByRole('heading', { name: /Compétences|Skills/i })).toBeInTheDocument();
  });

  it('renders projects section', () => {
    render(<PortfolioPage />);
    // Projects heading can be "Projets" (FR) or "Projects" (EN)
    expect(screen.getByRole('heading', { name: /Projets|Projects/i })).toBeInTheDocument();
  });

  it('displays key skills', () => {
    render(<PortfolioPage />);
    expect(screen.getByText(/Next\.js, React, TypeScript/i)).toBeInTheDocument();
  });
});
