import { describe, expect, it } from 'vitest'
import { DEMO_HREF } from './demo'

describe('DEMO_HREF', () => {
  it('points at the single booking surface in the hero', () => {
    expect(DEMO_HREF).toBe('#demo')
  })
})
