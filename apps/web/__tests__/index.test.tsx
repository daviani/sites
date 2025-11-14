import { render, screen } from '@testing-library/react'
import RootPage from '@/app/page'

describe('Homepage', () => {
  it('renders the main heading', () => {
    render(<RootPage />)
    const heading = screen.getByRole('heading', { name: /Daviani Fillatre/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<RootPage />)
    const subtitle = screen.getByText(/Développeur Full-Stack & DevOps/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('renders navigation cards', () => {
    render(<RootPage />)
    expect(screen.getByRole('heading', { name: /Portfolio/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Blog/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^CV$/i })).toBeInTheDocument()
  })

  it('has correct links for navigation cards', () => {
    render(<RootPage />)
    const portfolioLink = screen.getByRole('link', { name: /Portfolio/i })
    expect(portfolioLink).toHaveAttribute('href', 'https://portfolio.daviani.dev')
  })
})
