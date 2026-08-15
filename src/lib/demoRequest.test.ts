import { describe, expect, it } from 'vitest'
import {
  DEMO_EMAIL,
  buildNotificationEmail,
  isBotSubmission,
  isContactMethod,
  validateDemoRequest,
} from './demoRequest'

describe('demoRequest', () => {
  it('routes requests to the clinic demo inbox', () => {
    expect(DEMO_EMAIL).toBe('demo@madisonaiclinic.com')
  })

  describe('isContactMethod', () => {
    it('accepts only the two methods the form offers', () => {
      expect(isContactMethod('phone')).toBe(true)
      expect(isContactMethod('email')).toBe(true)
      expect(isContactMethod('carrier-pigeon')).toBe(false)
      expect(isContactMethod(undefined)).toBe(false)
    })
  })

  describe('isBotSubmission', () => {
    it('flags a payload that filled in the hidden decoy field', () => {
      expect(isBotSubmission({ name: 'Dana', company: 'Acme Corp' })).toBe(true)
    })

    it('passes a payload that left the decoy empty, absent, or whitespace', () => {
      expect(isBotSubmission({ name: 'Dana', company: '' })).toBe(false)
      expect(isBotSubmission({ name: 'Dana', company: '   ' })).toBe(false)
      expect(isBotSubmission({ name: 'Dana' })).toBe(false)
    })

    it('ignores a non-string decoy value rather than treating it as filled', () => {
      expect(isBotSubmission({ company: 1 })).toBe(false)
      expect(isBotSubmission(null)).toBe(false)
      expect(isBotSubmission('nope')).toBe(false)
    })
  })

  describe('validateDemoRequest', () => {
    it('accepts a phone request and trims the values it returns', () => {
      const result = validateDemoRequest({
        name: '  Dana Reyes  ',
        contactMethod: 'phone',
        contact: ' (608) 555-0134 ',
      })

      expect(result).toEqual({
        ok: true,
        value: { name: 'Dana Reyes', contactMethod: 'phone', contact: '(608) 555-0134' },
      })
    })

    it('accepts an email request', () => {
      const result = validateDemoRequest({
        name: 'Dana Reyes',
        contactMethod: 'email',
        contact: 'dana@example.com',
      })

      expect(result).toEqual({
        ok: true,
        value: { name: 'Dana Reyes', contactMethod: 'email', contact: 'dana@example.com' },
      })
    })

    it('rejects a blank or whitespace-only name', () => {
      const result = validateDemoRequest({
        name: '   ',
        contactMethod: 'email',
        contact: 'dana@example.com',
      })

      expect(result.ok).toBe(false)
      expect(result.ok === false && result.errors.name).toBe('Please tell us your name.')
      expect(result.ok === false && result.errors.contact).toBeUndefined()
    })

    it('asks for the missing contact value in the words of the chosen method', () => {
      const byPhone = validateDemoRequest({ name: 'Dana', contactMethod: 'phone', contact: '' })
      const byEmail = validateDemoRequest({ name: 'Dana', contactMethod: 'email', contact: '' })

      expect(byPhone.ok === false && byPhone.errors.contact).toBe(
        'Please add a phone number we can call.',
      )
      expect(byEmail.ok === false && byEmail.errors.contact).toBe(
        'Please add an email address we can reply to.',
      )
    })

    it('rejects a phone number with fewer than ten digits', () => {
      const result = validateDemoRequest({
        name: 'Dana',
        contactMethod: 'phone',
        contact: '555-0134',
      })

      expect(result.ok === false && result.errors.contact).toBe(
        'That phone number looks incomplete — include the area code.',
      )
    })

    it('ignores punctuation and country code when counting phone digits', () => {
      const result = validateDemoRequest({
        name: 'Dana',
        contactMethod: 'phone',
        contact: '+1 (608) 555-0134',
      })

      expect(result.ok).toBe(true)
    })

    it('rejects an email address without an @ or a dotted domain', () => {
      const noAt = validateDemoRequest({ name: 'Dana', contactMethod: 'email', contact: 'dana.example.com' })
      const noDot = validateDemoRequest({ name: 'Dana', contactMethod: 'email', contact: 'dana@example' })

      expect(noAt.ok === false && noAt.errors.contact).toBe('That email address does not look right.')
      expect(noDot.ok === false && noDot.errors.contact).toBe('That email address does not look right.')
    })

    it('reports both fields at once so the visitor fixes them in one pass', () => {
      const result = validateDemoRequest({ name: '', contactMethod: 'phone', contact: '' })

      expect(result.ok === false && result.errors).toEqual({
        name: 'Please tell us your name.',
        contact: 'Please add a phone number we can call.',
      })
    })

    it('falls back to email rules when the method is missing or unrecognized', () => {
      const missing = validateDemoRequest({ name: 'Dana', contact: 'dana@example.com' })
      const bogus = validateDemoRequest({ name: 'Dana', contactMethod: 'fax', contact: '6085550134' })

      expect(missing).toEqual({
        ok: true,
        value: { name: 'Dana', contactMethod: 'email', contact: 'dana@example.com' },
      })
      expect(bogus.ok === false && bogus.errors.contact).toBe('That email address does not look right.')
    })

    it('rejects a payload that is not an object at all', () => {
      expect(validateDemoRequest(null).ok).toBe(false)
      expect(validateDemoRequest('nope').ok).toBe(false)
      expect(validateDemoRequest(undefined).ok).toBe(false)
    })

    it('ignores non-string field values rather than coercing them', () => {
      const result = validateDemoRequest({ name: 42, contactMethod: 'email', contact: ['a@b.co'] })

      expect(result.ok === false && result.errors).toEqual({
        name: 'Please tell us your name.',
        contact: 'Please add an email address we can reply to.',
      })
    })
  })

  describe('buildNotificationEmail', () => {
    it('puts the requester name in the subject so the inbox is scannable', () => {
      const { subject } = buildNotificationEmail({
        name: 'Dana Reyes',
        contactMethod: 'phone',
        contact: '6085550134',
      })

      expect(subject).toBe('Demo request — Dana Reyes')
    })

    it('labels the contact value by the method the visitor picked', () => {
      const byPhone = buildNotificationEmail({
        name: 'Dana Reyes',
        contactMethod: 'phone',
        contact: '(608) 555-0134',
      })
      const byEmail = buildNotificationEmail({
        name: 'Dana Reyes',
        contactMethod: 'email',
        contact: 'dana@example.com',
      })

      expect(byPhone.text).toContain('Prefers: Phone')
      expect(byPhone.text).toContain('Phone: (608) 555-0134')
      expect(byEmail.text).toContain('Prefers: Email')
      expect(byEmail.text).toContain('Email: dana@example.com')
    })

    it('says where the request came from', () => {
      const { text } = buildNotificationEmail({
        name: 'Dana Reyes',
        contactMethod: 'email',
        contact: 'dana@example.com',
      })

      expect(text).toContain('Dana Reyes asked for a free demo.')
      expect(text).toContain('Sent from the booking form on madisonaiclinic.com.')
    })
  })
})
