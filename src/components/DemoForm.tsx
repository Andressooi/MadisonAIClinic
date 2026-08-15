import { useId, useState } from 'react'
import {
  DEMO_EMAIL,
  HONEYPOT_FIELD,
  type ContactMethod,
  type DemoRequestErrors,
  validateDemoRequest,
} from '../lib/demoRequest'

type Status = 'idle' | 'submitting' | 'sent' | 'failed'

/**
 * The site's one booking surface. Every "Schedule a demo" CTA anchors here.
 *
 * Two fields and a choice, on purpose: the goal is to learn that someone
 * wants a demo, not to qualify them. Anything else we need we can ask on the
 * call. The visitor picks how they want to be reached rather than filling in
 * both a phone and an email, so nobody hands over a channel they don't use.
 */
export function DemoForm() {
  const fieldId = useId()
  const nameId = `${fieldId}-name`
  const contactId = `${fieldId}-contact`

  const [name, setName] = useState('')
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone')
  const [contact, setContact] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<DemoRequestErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  const byPhone = contactMethod === 'phone'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = validateDemoRequest({ name, contactMethod, contact })
    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.value, [HONEYPOT_FIELD]: honeypot }),
      })

      setStatus(response.ok ? 'sent' : 'failed')
    } catch {
      // Offline, blocked, DNS — from here they all mean the same thing to the
      // visitor, and the fallback address below is the answer to all of them.
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    // <output> carries an implicit role="status", so the swap is announced
    // without a heading — this is a status message, not a new page section.
    return (
      <output className="demo-form-done">
        <span className="demo-form-done-title">
          Thanks, {name.trim()} &mdash; we&rsquo;ll reach out shortly.
        </span>
        <span>
          You&rsquo;ll hear from a person, usually within one business day, to
          find a time that suits you. Nothing to pay and nothing to commit to.
        </span>
      </output>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form className="demo-form" onSubmit={handleSubmit} noValidate>
      <div className="demo-field">
        <label htmlFor={nameId}>Your name</label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name !== undefined}
          aria-describedby={errors.name === undefined ? undefined : `${nameId}-error`}
        />
        {errors.name !== undefined && (
          <p className="demo-error" id={`${nameId}-error`}>
            {errors.name}
          </p>
        )}
      </div>

      <fieldset className="demo-field demo-choice">
        <legend>How should we reach you?</legend>
        <label>
          <input
            type="radio"
            name="contactMethod"
            value="phone"
            checked={byPhone}
            onChange={() => setContactMethod('phone')}
          />
          Phone
        </label>
        <label>
          <input
            type="radio"
            name="contactMethod"
            value="email"
            checked={!byPhone}
            onChange={() => setContactMethod('email')}
          />
          Email
        </label>
      </fieldset>

      <div className="demo-field">
        <label htmlFor={contactId}>{byPhone ? 'Phone number' : 'Email address'}</label>
        <input
          id={contactId}
          name="contact"
          type={byPhone ? 'tel' : 'email'}
          inputMode={byPhone ? 'tel' : 'email'}
          autoComplete={byPhone ? 'tel' : 'email'}
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          aria-invalid={errors.contact !== undefined}
          aria-describedby={errors.contact === undefined ? undefined : `${contactId}-error`}
        />
        {errors.contact !== undefined && (
          <p className="demo-error" id={`${contactId}-error`}>
            {errors.contact}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, irresistible to form-filling bots.
          Anything typed here means the submission is not a person, so the
          server drops it. Kept out of the tab order and off screen readers. */}
      <div className="demo-honeypot" aria-hidden="true">
        <label htmlFor={`${fieldId}-${HONEYPOT_FIELD}`}>Company (leave blank)</label>
        <input
          id={`${fieldId}-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request my demo'}
      </button>

      {status === 'failed' && (
        <p className="demo-error demo-error-block" role="alert">
          That didn&rsquo;t send. Email us at{' '}
          <a href={`mailto:${DEMO_EMAIL}`}>{DEMO_EMAIL}</a> and we&rsquo;ll pick it
          up from there.
        </p>
      )}

      <p className="demo-form-note">
        Madison and Dane County. No cost, no obligation. We use your details to
        set up the demo and nothing else.
      </p>
    </form>
  )
}
