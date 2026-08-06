import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('renders the business location and a contact-details placeholder', () => {
    render(<SiteFooter />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('MadisonAIClinic — Madison, Wisconsin')).toBeInTheDocument()
    expect(screen.getByText('Contact details to come')).toBeInTheDocument()
  })
})
