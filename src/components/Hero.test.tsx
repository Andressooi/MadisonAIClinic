import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the single page h1 with the core thesis', () => {
    render(<Hero />)

    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('For forty years, technology has favored large corporations. AI levels the playing field.')
  })

  it('renders the demo panel as a distinct landmark with its own heading', () => {
    render(<Hero />)

    expect(document.getElementById('demo')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'A free demo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Schedule a demo' })).toBeInTheDocument()
    expect(screen.getByText('Madison and Dane County. No cost, no obligation.')).toBeInTheDocument()
  })
})
