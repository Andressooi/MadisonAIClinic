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

  it('owns the anchor every demo CTA points at', () => {
    render(<Closing />)

    expect(document.getElementById('demo')).not.toBeNull()
    expect(DEMO_HREF).toBe('#demo')
  })

  it('puts the booking form in the closing section', () => {
    render(<Closing />)

    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request my demo' })).toBeInTheDocument()
  })
})
