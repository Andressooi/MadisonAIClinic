import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Faq } from './Faq'

describe('Faq', () => {
  it('labels the section with its visible heading', () => {
    render(<Faq />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Frequently asked questions' })
    const section = heading.closest('section')
    expect(section).toHaveAttribute('aria-labelledby', heading.id)
  })

  it('renders one closed accordion item per question, each with its answer', () => {
    render(<Faq />)

    const items = document.querySelectorAll('details.faq-item')
    expect(items).toHaveLength(6)
    items.forEach((item) => expect(item).not.toHaveAttribute('open'))

    expect(screen.getByText('Where do you work?')).toBeInTheDocument()
    expect(
      screen.getByText('Madison and Dane County, Wisconsin, on-site at your business.'),
    ).toBeInTheDocument()
  })

  it('answers the cost question with the flat-rate pricing model', () => {
    render(<Faq />)

    expect(
      screen.getByText('How much does AI automation cost for a small business?'),
    ).toBeInTheDocument()
    expect(screen.getByText(/One flat rate per project/)).toBeInTheDocument()
  })
})
