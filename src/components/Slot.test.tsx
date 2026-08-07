import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Slot } from './Slot'

describe('Slot', () => {
  it('renders its children inside a paragraph with the slot class', () => {
    render(<Slot>Placeholder copy</Slot>)

    const paragraph = screen.getByText('Placeholder copy')
    expect(paragraph.tagName).toBe('P')
    expect(paragraph).toHaveClass('slot')
  })
})
