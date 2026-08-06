import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HonestVersion } from './HonestVersion'

describe('HonestVersion', () => {
  it('renders the objection as the heading', () => {
    render(<HonestVersion />)

    expect(
      screen.getByRole('heading', { level: 2, name: '“I don’t understand the value yet.”' }),
    ).toBeInTheDocument()
  })

  it('renders both response paragraphs', () => {
    render(<HonestVersion />)

    expect(screen.getByText(/why the demo is free/)).toBeInTheDocument()
    expect(screen.getByText(/six to twelve hours a week we usually find/)).toBeInTheDocument()
  })
})
