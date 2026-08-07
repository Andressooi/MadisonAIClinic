import { describe, expect, it } from 'vitest'
import { render } from './entry-server'

describe('entry-server render', () => {
  it('renders the app to a markup string containing the page landmarks', () => {
    const html = render()

    expect(typeof html).toBe('string')
    expect(html).toContain('id="main"')
    expect(html).toContain('MadisonAIClinic')
    expect(html).toContain('Frequently asked questions')
  })
})
