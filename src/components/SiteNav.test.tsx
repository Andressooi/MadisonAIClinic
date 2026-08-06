import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteNav } from './SiteNav'
import { DEMO_HREF } from '../lib/demo'

describe('SiteNav', () => {
  it('exposes a single labeled primary navigation landmark', () => {
    render(<SiteNav />)

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByText('MadisonAIClinic')).toBeInTheDocument()
  })

  it('links each section anchor to the right id', () => {
    render(<SiteNav />)

    expect(screen.getByRole('link', { name: 'The shift' })).toHaveAttribute('href', '#the-shift')
    expect(screen.getByRole('link', { name: 'Why now' })).toHaveAttribute('href', '#why-now')
    expect(screen.getByRole('link', { name: 'Who it’s for' })).toHaveAttribute('href', '#who-its-for')
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '#faq')
  })

  it('routes the CTA to the shared demo anchor', () => {
    render(<SiteNav />)

    expect(screen.getByRole('link', { name: 'Schedule a demo' })).toHaveAttribute('href', DEMO_HREF)
  })
})
