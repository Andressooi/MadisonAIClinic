import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WhoWeAre } from './WhoWeAre'

describe('WhoWeAre', () => {
  it('renders a grayscale photo placeholder for the founder', () => {
    render(<WhoWeAre />)

    const figure = document.querySelector('figure.who-photo')
    expect(figure).not.toBeNull()
    expect(figure).toHaveClass('grayscale')
    expect(screen.getByText('Drop a photo — the founder, on site')).toBeInTheDocument()
  })

  it('renders the pending name heading and bio slot', () => {
    render(<WhoWeAre />)

    expect(screen.getByRole('heading', { level: 2, name: 'TODO — name' })).toBeInTheDocument()
    expect(screen.getByText(/why you are the person to do this work/)).toBeInTheDocument()
  })
})
