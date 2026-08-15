import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('renders the logo lockup, the business location and a contact-details placeholder', () => {
    render(<SiteFooter />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('MadisonAIClinic')).toHaveClass('visually-hidden')
    expect(screen.getByText('Madison, Wisconsin')).toBeInTheDocument()
    expect(screen.getByText('Contact details to come')).toBeInTheDocument()
  })
})
