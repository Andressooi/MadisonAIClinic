/**
 * The shape of a demo request, plus the validation and message-building that
 * both sides of the wire need.
 *
 * The browser form (`src/components/DemoForm.tsx`) and the serverless handler
 * (`api/demo.ts`) import from here so a request is checked by the same rules
 * in both places — the client for fast feedback, the server because anything
 * can POST to a public endpoint. Keeping the logic in `src/` also keeps it
 * under the 100% coverage threshold; `api/demo.ts` stays a thin shell of I/O.
 */

/** Where the demo request lands. Also the fallback shown if the POST fails. */
export const DEMO_EMAIL = 'demo@madisonaiclinic.com'

/**
 * Name of the hidden decoy field on the form. A real visitor never sees it,
 * so anything in it identifies the sender as a bot. Named `company` because
 * that is what the bots are looking for — `honeypot` would give it away.
 */
export const HONEYPOT_FIELD = 'company'

/** True when a payload tripped the decoy field and should be dropped. */
export function isBotSubmission(input: unknown): boolean {
  const source = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>
  const trap = source[HONEYPOT_FIELD]

  return typeof trap === 'string' && trap.trim() !== ''
}

/** How the visitor asked to be reached. */
export type ContactMethod = 'phone' | 'email'

export interface DemoRequest {
  name: string
  contactMethod: ContactMethod
  contact: string
}

/** Field name → message, for the fields that failed. */
export type DemoRequestErrors = Partial<Record<'name' | 'contact', string>>

export type DemoRequestValidation =
  | { ok: true; value: DemoRequest }
  | { ok: false; errors: DemoRequestErrors }

/**
 * Deliberately permissive: one @ with something either side and no spaces.
 * A stricter pattern rejects real addresses, and the only thing riding on
 * this is whether we can reply — a typo'd address fails either way.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Ten digits is a US number with area code; punctuation and +1 are ignored. */
const MIN_PHONE_DIGITS = 10

export function isContactMethod(value: unknown): value is ContactMethod {
  return value === 'phone' || value === 'email'
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Validates an untrusted object into a `DemoRequest`. An unrecognized (or
 * missing) contact method is treated as email rather than reported as its own
 * error — the form always sends one, so a bad value means a hand-rolled POST,
 * and the contact field still has to stand up on its own.
 */
export function validateDemoRequest(input: unknown): DemoRequestValidation {
  const source = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>

  const name = asTrimmedString(source.name)
  const contact = asTrimmedString(source.contact)
  const contactMethod: ContactMethod = isContactMethod(source.contactMethod)
    ? source.contactMethod
    : 'email'

  const errors: DemoRequestErrors = {}

  if (name === '') {
    errors.name = 'Please tell us your name.'
  }

  if (contact === '') {
    errors.contact =
      contactMethod === 'phone'
        ? 'Please add a phone number we can call.'
        : 'Please add an email address we can reply to.'
  } else if (contactMethod === 'phone') {
    const digits = contact.replace(/\D/g, '')
    if (digits.length < MIN_PHONE_DIGITS) {
      errors.contact = 'That phone number looks incomplete — include the area code.'
    }
  } else if (!EMAIL_PATTERN.test(contact)) {
    errors.contact = 'That email address does not look right.'
  }

  if (errors.name !== undefined || errors.contact !== undefined) {
    return { ok: false, errors }
  }

  return { ok: true, value: { name, contactMethod, contact } }
}

/**
 * The notification we send ourselves. Plain text on purpose: it has to be
 * readable in a phone's mail app in two seconds, and there is nothing here
 * that markup would clarify.
 */
export function buildNotificationEmail(request: DemoRequest): { subject: string; text: string } {
  const label = request.contactMethod === 'phone' ? 'Phone' : 'Email'

  return {
    subject: `Demo request — ${request.name}`,
    text: [
      `${request.name} asked for a free demo.`,
      '',
      `Prefers: ${label}`,
      `${label}: ${request.contact}`,
      '',
      'Sent from the booking form on madisonaiclinic.com.',
    ].join('\n'),
  }
}
