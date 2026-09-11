/**
 * The shape of a score request, plus the checks and the message body that both
 * sides of the wire need.
 *
 * The browser (`public/main.js`) and the serverless handler (`api/score.js`)
 * import from here so a submission is judged by the same rules in both places:
 * the browser for fast feedback, the server because anything at all can POST
 * to a public endpoint.
 *
 * Plain ESM with explicit file extensions on every relative import. Vercel runs
 * these under plain Node, which will not resolve an extensionless specifier.
 */

/**
 * Name of the hidden decoy field. A real visitor never sees it, so anything in
 * it identifies the sender as a bot.
 *
 * Deliberately not `company` or `organization` — those names match browser and
 * password-manager autofill heuristics closely enough that a real visitor's
 * browser can silently fill the trap, which then drops their submission on the
 * floor with no error shown. The visible label can still say "Company" for a
 * bot's benefit; only the name/id needs to dodge autofill.
 */
export const HONEYPOT_FIELD = 'reference_code'

export const LIMITS = { business: 120, website: 200, email: 200 }

/** The five things a visitor can ask for from the one form. */
export const INTEREST_OPTIONS = [
  { value: 'free-report', label: 'The Report (free)' },
  { value: 'advanced-report', label: 'Advanced Report (+$250 add-on)' },
  { value: 'fixed-for-you', label: 'Fixed For You ($1,500)' },
  { value: 'full-ecommerce', label: 'Full E-Commerce ($3,500)' },
  { value: 'ai-automation', label: 'Special AI Automation (custom quote)' },
]

const INTEREST_VALUES = new Set(INTEREST_OPTIONS.map((option) => option.value))

function interestLabel(value) {
  return INTEREST_OPTIONS.find((option) => option.value === value)?.label ?? value
}

/** True when a payload tripped the decoy and should be quietly dropped. */
export function isBotSubmission(input) {
  const source = typeof input === 'object' && input !== null ? input : {}
  const trap = source[HONEYPOT_FIELD]

  return typeof trap === 'string' && trap.trim() !== ''
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Turns what somebody typed into a URL we can put in an email and click.
 *
 * Owners type `northsideplumbing.com`, not `https://northsideplumbing.com`, so
 * a bare host is the common case rather than the exception. Returns null when
 * it cannot be read as a web address.
 */
export function normaliseWebsite(value) {
  const raw = text(value)
  if (raw === '' || /\s/.test(raw)) return null

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

  let url
  try {
    url = new URL(withScheme)
  } catch {
    return null
  }

  // A hostname with no dot is a local name, not a business's website. The
  // trailing-dot and leading-dot cases are what a typo looks like.
  const host = url.hostname
  if (!host.includes('.') || host.startsWith('.') || host.endsWith('.')) return null
  if (!/^[a-z0-9.-]+$/i.test(host)) return null
  if (!/\.[a-z]{2,}$/i.test(host)) return null

  return url.toString()
}

/**
 * Deliberately loose. The only address that truly validates is one that
 * accepts mail, so this catches typos and lets the mail server judge the rest.
 */
export function isEmailish(value) {
  const raw = text(value)

  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(raw) && raw.length <= LIMITS.email
}

/**
 * @returns {{ok: true, value: {interest: string, business: string, website: string, email: string}}
 *          | {ok: false, errors: Record<string, string>}}
 */
export function validateScoreRequest(input) {
  const source = typeof input === 'object' && input !== null ? input : {}
  const errors = {}

  const interest = text(source.interest)
  if (interest === '') errors.interest = 'Tell us which one you want.'
  else if (!INTEREST_VALUES.has(interest)) errors.interest = 'Pick one of the options listed.'

  const business = text(source.business)
  if (business === '') errors.business = 'Tell us the name of the business.'
  else if (business.length > LIMITS.business) errors.business = 'That is longer than we can store.'

  const rawWebsite = text(source.website)
  const website = normaliseWebsite(rawWebsite)
  if (rawWebsite === '') errors.website = 'We need the website to look at.'
  else if (rawWebsite.length > LIMITS.website) errors.website = 'That is longer than we can store.'
  else if (website === null) errors.website = 'That does not look like a web address.'

  const email = text(source.email)
  if (email === '') errors.email = 'We need somewhere to send the report.'
  else if (!isEmailish(email)) errors.email = 'That does not look like an email address.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  return { ok: true, value: { interest, business, website, email } }
}

/** The email that lands in the clinic's inbox. Plain text on purpose. */
export function buildNotificationEmail(request) {
  const subject = `${interestLabel(request.interest)} — ${request.business}`
  const text = [
    'A new request came in from madisonaiclinic.com.',
    '',
    `Interested in: ${interestLabel(request.interest)}`,
    `Business:      ${request.business}`,
    `Website:       ${request.website}`,
    `Email:         ${request.email}`,
    '',
    'Reply to this message to answer them directly.',
  ].join('\n')

  return { subject, text }
}
