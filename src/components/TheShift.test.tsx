import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TheShift } from './TheShift'

describe('TheShift', () => {
  it('renders the band headline inside the the-shift anchor section', () => {
    render(<TheShift />)

    const section = document.getElementById('the-shift')
    expect(section).not.toBeNull()
    expect(section).toHaveClass('band')

    const heading = screen.getByRole('heading', { level: 2 })
    expect(section).toContainElement(heading)
    expect(heading).toHaveTextContent('Match them on what you offer. Match them on what it costs. Then beat them on the part they can never buy.')
  })

  it('renders the thesis paragraphs, ending on the closing line', () => {
    render(<TheShift />)

    const paragraphs = document.querySelectorAll('.thesis p')
    expect(paragraphs).toHaveLength(4)
    expect(paragraphs[paragraphs.length - 1]).toHaveClass('thesis-close')
    expect(paragraphs[paragraphs.length - 1]).toHaveTextContent('You don’t catch up. You go ahead.')
  })
})
