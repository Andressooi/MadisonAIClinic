import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WhyNow } from './WhyNow'

describe('WhyNow', () => {
  it('renders the why-now section with its thesis heading', () => {
    render(<WhyNow />)

    const section = document.getElementById('why-now')
    expect(section).not.toBeNull()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Being small is the advantage. That is temporary.' }),
    ).toBeInTheDocument()
  })

  it('renders the objection and its rebuttal', () => {
    render(<WhyNow />)

    expect(screen.getByText('The obvious objection')).toBeInTheDocument()
    expect(
      screen.getByText('“The tools get better every month. Why not wait?”'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Waiting does not buy you a better starting position/)).toBeInTheDocument()
  })
})
