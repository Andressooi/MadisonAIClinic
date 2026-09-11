import { describe, expect, it } from 'vitest'
import {
  HONEYPOT_FIELD,
  buildNotificationEmail,
  isBotSubmission,
  isEmailish,
  normaliseWebsite,
  validateScoreRequest,
} from '../public/lib/scoreRequest.js'

const good = {
  interest: 'free-report',
  business: 'Northside Plumbing & Drain',
  website: 'northsideplumbing.com',
  email: 'owner@northsideplumbing.com',
}

describe('isBotSubmission', () => {
  it('passes a submission that left the decoy alone', () => {
    expect(isBotSubmission(good)).toBe(false)
    expect(isBotSubmission({ ...good, [HONEYPOT_FIELD]: '   ' })).toBe(false)
  })

  it('catches one that filled the decoy in', () => {
    expect(isBotSubmission({ ...good, [HONEYPOT_FIELD]: 'Acme' })).toBe(true)
  })

  it('survives a payload that is not an object', () => {
    expect(isBotSubmission(null)).toBe(false)
    expect(isBotSubmission('nope')).toBe(false)
  })
})

describe('normaliseWebsite', () => {
  it('adds a scheme to the bare host an owner actually types', () => {
    expect(normaliseWebsite('northsideplumbing.com')).toBe('https://northsideplumbing.com/')
    expect(normaliseWebsite('  www.northsideplumbing.com  ')).toBe('https://www.northsideplumbing.com/')
  })

  it('keeps a scheme that is already there', () => {
    expect(normaliseWebsite('http://northsideplumbing.com/drains')).toBe('http://northsideplumbing.com/drains')
  })

  it('rejects what is not a web address', () => {
    for (const bad of ['', '   ', 'localhost', 'not a url', 'northsideplumbing', '.com', 'plumbing.', 'plumbing.c']) {
      expect(normaliseWebsite(bad), bad).toBeNull()
    }
  })
})

describe('isEmailish', () => {
  it('accepts an ordinary address', () => {
    expect(isEmailish('owner@northsideplumbing.com')).toBe(true)
    expect(isEmailish('owner@mail.northsideplumbing.co.uk')).toBe(true)
  })

  it('rejects the common typos', () => {
    for (const bad of ['', 'owner', 'owner@', '@northside.com', 'owner@northside', 'a b@c.com']) {
      expect(isEmailish(bad), bad).toBe(false)
    }
  })
})

describe('validateScoreRequest', () => {
  it('accepts a filled-in form and hands back trimmed, normalised values', () => {
    const result = validateScoreRequest({
      interest: 'fixed-for-you',
      business: '  Northside Plumbing & Drain ',
      website: 'northsideplumbing.com',
      email: '  owner@northsideplumbing.com ',
    })

    expect(result).toEqual({
      ok: true,
      value: {
        interest: 'fixed-for-you',
        business: 'Northside Plumbing & Drain',
        website: 'https://northsideplumbing.com/',
        email: 'owner@northsideplumbing.com',
      },
    })
  })

  it('names every empty field rather than only the first', () => {
    const result = validateScoreRequest({})

    expect(result.ok).toBe(false)
    expect(Object.keys(result.errors).sort()).toEqual(['business', 'email', 'interest', 'website'])
  })

  it('rejects an interest that is not one of the five options', () => {
    const result = validateScoreRequest({ ...good, interest: 'gold-plated-everything' })

    expect(result.ok).toBe(false)
    expect(result.errors.interest).toMatch(/one of the options/)
  })

  it('tells an owner their website is unreadable rather than missing', () => {
    const result = validateScoreRequest({ ...good, website: 'my shop' })

    expect(result.ok).toBe(false)
    expect(result.errors.website).toMatch(/web address/)
    expect(result.errors.business).toBeUndefined()
  })

  it('refuses input longer than we can store', () => {
    const result = validateScoreRequest({ ...good, business: 'x'.repeat(121) })

    expect(result.ok).toBe(false)
    expect(result.errors.business).toBeDefined()
  })

  it('survives a payload that is not an object', () => {
    expect(validateScoreRequest(null).ok).toBe(false)
  })
})

describe('buildNotificationEmail', () => {
  it('puts the interest and business in the subject and every field in the body', () => {
    const { subject, text } = buildNotificationEmail({
      interest: 'fixed-for-you',
      business: 'Northside Plumbing & Drain',
      website: 'https://northsideplumbing.com/',
      email: 'owner@northsideplumbing.com',
    })

    expect(subject).toBe('Fixed For You ($1,500) — Northside Plumbing & Drain')
    expect(text).toContain('Fixed For You ($1,500)')
    expect(text).toContain('https://northsideplumbing.com/')
    expect(text).toContain('owner@northsideplumbing.com')
    expect(text).toContain('Northside Plumbing & Drain')
  })
})
