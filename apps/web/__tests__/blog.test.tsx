import { render, screen } from '@testing-library/react'
import BlogPage from '@/app/blog/page'

describe('Blog Page', () => {
  it('renders the blog heading', () => {
    render(<BlogPage />)
    const heading = screen.getByRole('heading', { name: /Blog/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the blog description', () => {
    render(<BlogPage />)
    const description = screen.getByText(/Articles techniques/i)
    expect(description).toBeInTheDocument()
  })
})
