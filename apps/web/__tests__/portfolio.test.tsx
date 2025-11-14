import { render, screen } from '@testing-library/react'
import PortfolioPage from '@/app/portfolio/page'

describe('Portfolio Page', () => {
  it('renders the main heading', () => {
    render(<PortfolioPage />)
    const heading = screen.getByRole('heading', { name: /Daviani Fillatre/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders skills section', () => {
    render(<PortfolioPage />)
    expect(screen.getByRole('heading', { name: /Compétences/i })).toBeInTheDocument()
  })

  it('renders projects section', () => {
    render(<PortfolioPage />)
    expect(screen.getByRole('heading', { name: /Projets/i })).toBeInTheDocument()
  })

  it('displays key skills', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/Next\.js, React, TypeScript/i)).toBeInTheDocument()
  })
})
