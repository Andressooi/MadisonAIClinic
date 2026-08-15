import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DemoForm } from './DemoForm'

/** A resolved fetch stand-in; `ok` is all the component reads. */
function fetchResult(ok: boolean) {
  return Promise.resolve({ ok } as Response)
}

/** Renders the form and fills it out, returning the driver for what's next. */
async function fillIn(name: string, contact: string) {
  const user = userEvent.setup()
  render(<DemoForm />)
  await user.type(screen.getByLabelText('Your name'), name)
  await user.type(screen.getByLabelText(/Phone number|Email address/), contact)
  return user
}

describe('DemoForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => fetchResult(true)))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('asks only for a name, a preferred method, and one way to reach them', () => {
    render(<DemoForm />)

    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'How should we reach you?' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Phone' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked()
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('type', 'tel')
  })

  it('carries the no-cost, Dane County framing into the booking step', () => {
    render(<DemoForm />)

    expect(
      screen.getByText(/Madison and Dane County\. No cost, no obligation\./),
    ).toBeInTheDocument()
  })

  it('swaps the contact field to an email input when the method changes', async () => {
    const user = userEvent.setup()
    render(<DemoForm />)

    await user.click(screen.getByRole('radio', { name: 'Email' }))

    const field = screen.getByLabelText('Email address')
    expect(field).toHaveAttribute('type', 'email')
    expect(screen.queryByLabelText('Phone number')).toBeNull()
  })

  it('swaps back to a phone input when the visitor changes their mind', async () => {
    const user = userEvent.setup()
    render(<DemoForm />)

    await user.click(screen.getByRole('radio', { name: 'Email' }))
    await user.click(screen.getByRole('radio', { name: 'Phone' }))

    expect(screen.getByRole('radio', { name: 'Phone' })).toBeChecked()
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('type', 'tel')
  })

  it('blocks an empty submission and names both problems', async () => {
    const user = userEvent.setup()
    render(<DemoForm />)

    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    expect(screen.getByText('Please tell us your name.')).toBeInTheDocument()
    expect(screen.getByText('Please add a phone number we can call.')).toBeInTheDocument()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('marks an invalid field for assistive tech, not just visually', async () => {
    const user = await fillIn('Dana Reyes', '555')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    const field = screen.getByLabelText('Phone number')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription(
      'That phone number looks incomplete — include the area code.',
    )
  })

  it('posts the request and confirms by name', async () => {
    const user = await fillIn('Dana Reyes', '6085550134')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Thanks, Dana Reyes — we’ll reach out shortly.',
      )
    })

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dana Reyes',
        contactMethod: 'phone',
        contact: '6085550134',
        company: '',
      }),
    })
    expect(screen.queryByRole('button', { name: 'Request my demo' })).toBeNull()
  })

  it('clears an earlier error once the visitor fixes it', async () => {
    const user = userEvent.setup()
    render(<DemoForm />)

    await user.click(screen.getByRole('button', { name: 'Request my demo' }))
    expect(screen.getByText('Please tell us your name.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Your name'), 'Dana Reyes')
    await user.type(screen.getByLabelText('Phone number'), '6085550134')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())
    expect(screen.queryByText('Please tell us your name.')).toBeNull()
  })

  it('offers the demo inbox as a fallback when the server rejects the send', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fetchResult(false)))
    const user = await fillIn('Dana Reyes', '6085550134')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('That didn’t send.')
    expect(screen.getByRole('link', { name: 'demo@madisonaiclinic.com' })).toHaveAttribute(
      'href',
      'mailto:demo@madisonaiclinic.com',
    )
    // The typed values survive, so retrying is one click and not a re-type.
    expect(screen.getByLabelText('Your name')).toHaveValue('Dana Reyes')
  })

  it('treats a network failure the same as a rejection', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
    const user = await fillIn('Dana Reyes', '6085550134')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('That didn’t send.')
  })

  it('disables the button while the request is in flight', async () => {
    let release: (value: Response) => void = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (release = resolve))),
    )

    const user = await fillIn('Dana Reyes', '6085550134')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    const button = await screen.findByRole('button', { name: 'Sending…' })
    expect(button).toBeDisabled()

    release({ ok: true } as Response)
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())
  })

  it('hides the honeypot from people while still submitting it', async () => {
    render(<DemoForm />)

    const trap = document.querySelector<HTMLInputElement>('input[name="company"]')
    expect(trap).not.toBeNull()
    expect(trap).toHaveAttribute('tabindex', '-1')
    expect(trap?.closest('.demo-honeypot')).toHaveAttribute('aria-hidden', 'true')
  })

  it('sends whatever a bot types into the honeypot so the server can drop it', async () => {
    const user = await fillIn('Dana Reyes', '6085550134')

    const trap = document.querySelector<HTMLInputElement>('input[name="company"]')!
    await user.type(trap, 'Acme Corp')
    await user.click(screen.getByRole('button', { name: 'Request my demo' }))

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
    const [, init] = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(JSON.parse(init?.body as string).company).toBe('Acme Corp')
  })
})
