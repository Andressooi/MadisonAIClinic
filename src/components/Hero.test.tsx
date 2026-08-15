import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { DEMO_HREF } from '../lib/demo'

describe('Hero', () => {
  it('renders the single page h1 with the core thesis', () => {
    render(<Hero />)

    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('For forty years, technology has favored large corporations. AI levels the playing field.')
  })

  it('renders the demo panel with its own heading and framing', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { level: 2, name: 'A free demo' })).toBeInTheDocument()
    expect(screen.getByText('Madison and Dane County. No cost, no obligation.')).toBeInTheDocument()
  })

  it('sends its CTA down to the booking form rather than dead-ending', () => {
    render(<Hero />)

    expect(screen.getByRole('link', { name: 'Schedule a demo' })).toHaveAttribute('href', DEMO_HREF)
    expect(screen.queryByRole('button', { name: 'Schedule a demo' })).toBeNull()
  })
})
