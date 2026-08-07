import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Closing } from './Closing'
import { DEMO_HREF } from '../lib/demo'

describe('Closing', () => {
  it('renders the closing headline', () => {
    render(<Closing />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('See what it does before you spend a dollar.')
  })

  it('links the CTA to the shared demo anchor', () => {
    render(<Closing />)

    const link = screen.getByRole('link', { name: 'Schedule a demo' })
    expect(link).toHaveAttribute('href', DEMO_HREF)
  })
})
