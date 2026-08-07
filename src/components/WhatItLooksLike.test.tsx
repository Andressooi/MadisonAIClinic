import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { WhatItLooksLike } from './WhatItLooksLike'

describe('WhatItLooksLike', () => {
  it('renders one before/after card per transformation', () => {
    render(<WhatItLooksLike />)

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
    expect(cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Quoting',
      'Intake',
      'Reporting',
    ])
  })

  it('pairs a Today/After definition list inside the quoting card', () => {
    render(<WhatItLooksLike />)

    const quotingCard = screen.getByRole('heading', { level: 3, name: 'Quoting' }).closest('article')
    expect(quotingCard).not.toBeNull()

    const card = within(quotingCard as HTMLElement)
    expect(card.getByText('Today')).toBeInTheDocument()
    expect(card.getByText(/A quote takes two days/)).toBeInTheDocument()
    expect(card.getByText('After')).toBeInTheDocument()
    expect(card.getByText(/It goes out in ten minutes/)).toBeInTheDocument()
  })

  it('renders the setup/training/support model beneath the cards', () => {
    render(<WhatItLooksLike />)

    expect(screen.getByText('How it gets there')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Setup' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Training' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Support' })).toBeInTheDocument()
  })
})
