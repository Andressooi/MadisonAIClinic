import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from 'react'

// main.tsx mounts the app as a side effect of being imported, and picks
// createRoot vs hydrateRoot based on whether #root already has markup in it
// (see the comment in main.tsx). Each branch is only reachable by importing
// a fresh copy of the module against a DOM we've set up beforehand.
describe('main entry point', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does a plain client render when #root starts empty, as in dev', async () => {
    document.body.innerHTML = '<div id="root"></div>'

    await act(async () => {
      await import('./main')
    })

    const root = document.getElementById('root')
    expect(root?.querySelector('nav[aria-label="Primary"]')).not.toBeNull()
    expect(root?.querySelector('h1')).not.toBeNull()
  })

  it('hydrates in place when #root already holds prerendered markup, as in production', async () => {
    const { render } = await import('./entry-server')
    document.body.innerHTML = `<div id="root">${render()}</div>`
    const root = document.getElementById('root') as HTMLElement
    const nodeBeforeHydration = root.querySelector('nav')

    await act(async () => {
      await import('./main')
    })

    // Hydration attaches behavior to the existing DOM rather than discarding
    // and rebuilding it, so the original server-rendered nav node survives.
    expect(root.querySelector('nav[aria-label="Primary"]')).toBe(nodeBeforeHydration)
  })
})
