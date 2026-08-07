import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders a skip link that targets the main landmark', () => {
    render(<App />)

    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(skipLink).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })

  it('composes the nav, every anchor target, and the footer', () => {
    render(<App />)

    const sectionIds = ['demo', 'the-shift', 'why-now', 'what-it-looks-like', 'who-its-for', 'faq']
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      expect(el).not.toBeNull()
      expect(document.body.contains(el)).toBe(true)
    })

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
