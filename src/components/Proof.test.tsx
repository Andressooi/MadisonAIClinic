import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Proof } from './Proof'

describe('Proof', () => {
  it('renders the kicker and a pending slot for the client result', () => {
    render(<Proof />)

    expect(screen.getByText('One we have done')).toBeInTheDocument()
    expect(screen.getByText(/one real client result/)).toBeInTheDocument()
    expect(document.querySelector('p.slot')).not.toBeNull()
  })
})
