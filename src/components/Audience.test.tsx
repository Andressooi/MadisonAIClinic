import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Audience } from './Audience'

describe('Audience', () => {
  it('renders the who-its-for section with a heading kicker', () => {
    render(<Audience />)

    const section = document.getElementById('who-its-for')
    expect(section).not.toBeNull()
    expect(screen.getByText('Who it’s for')).toBeInTheDocument()
  })

  it('renders one header row and one row per audience segment', () => {
    render(<Audience />)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(5)

    const headerCells = within(rows[0]).getAllByRole('columnheader')
    expect(headerCells.map((cell) => cell.textContent)).toEqual([
      'Business',
      'What we usually automate first',
      'What it gives back',
    ])
  })

  it('renders the solo founders row with its automation and payoff copy', () => {
    render(<Audience />)

    const founderCell = screen.getByText('Solo founders')
    const row = founderCell.closest('tr')
    expect(row).not.toBeNull()
    expect(within(row as HTMLElement).getByText('Inbox triage, proposals, bookkeeping prep')).toBeInTheDocument()
    expect(
      within(row as HTMLElement).getByText('The four roles you’re worst at, off your desk'),
    ).toBeInTheDocument()
  })
})
