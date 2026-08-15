import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo', () => {
  it('names the lockup for screen readers and hides the wordmark from them', () => {
    render(<Logo />)

    expect(screen.getByText('MadisonAIClinic')).toHaveClass('visually-hidden')
    expect(screen.getByText('madison ai clinic')).toHaveAttribute('aria-hidden', 'true')
  })

  it('defaults to the ink tone at 18px and scales from the size prop', () => {
    const { rerender } = render(<Logo />)

    const logo = screen.getByText('MadisonAIClinic').parentElement!
    expect(logo).toHaveClass('logo')
    expect(logo.className).toBe('logo')
    expect(logo).toHaveStyle({ '--logo-size': '18px' })

    rerender(<Logo size={40} />)
    expect(screen.getByText('MadisonAIClinic').parentElement).toHaveStyle({
      '--logo-size': '40px',
    })
  })

  it('takes a tone class for red and ink grounds', () => {
    const { rerender } = render(<Logo tone="on-red" />)

    expect(screen.getByText('MadisonAIClinic').parentElement).toHaveClass('logo-on-red')

    rerender(<Logo tone="on-dark" />)
    expect(screen.getByText('MadisonAIClinic').parentElement).toHaveClass('logo-on-dark')
  })
})
