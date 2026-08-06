import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pricing } from './Pricing'

describe('Pricing', () => {
  it('renders the pricing heading', () => {
    render(<Pricing />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'One flat rate per project. We get it done.' }),
    ).toBeInTheDocument()
  })

  it('renders a project-rate row and a monthly-support row, each as a pending slot', () => {
    render(<Pricing />)

    expect(screen.getByRole('heading', { level: 3, name: 'The project' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Monthly support' })).toBeInTheDocument()

    const slots = document.querySelectorAll('p.slot')
    expect(slots).toHaveLength(2)
    expect(slots[0]).toHaveTextContent('TODO — the flat project rate, e.g. $X.')
    expect(slots[1]).toHaveTextContent('TODO — the monthly support figure, e.g. $X per month.')
  })
})
