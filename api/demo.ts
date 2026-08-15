import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createTransport } from 'nodemailer'
import {
  DEMO_EMAIL,
  buildNotificationEmail,
  isBotSubmission,
  validateDemoRequest,
} from '../src/lib/demoRequest'

/**
 * Receives a demo request from the booking form and emails it to the clinic.
 *
 * Sends over SMTP through the clinic's own Google Workspace mailbox rather
 * than an email API, so no third party handles the leads. Deliverability
 * rules (SPF, DKIM, a warmed sending domain) are not a concern here: this is
 * our own mail server delivering to our own inbox, not outbound mail to
 * strangers who might filter it.
 *
 * Deliberately thin: every rule worth testing lives in `src/lib/demoRequest`,
 * which the unit suite covers. What is left here is I/O.
 *
 * Environment (Vercel project settings):
 *   SMTP_USER      required — the mailbox, e.g. demo@madisonaiclinic.com
 *   SMTP_PASSWORD  required — a Google app password, not the account password
 *   SMTP_HOST      optional — defaults to Gmail
 *   SMTP_PORT      optional — defaults to 465 (implicit TLS)
 */

const DEFAULT_HOST = 'smtp.gmail.com'
const DEFAULT_PORT = 465

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vercel parses a JSON body for us; a string body means a client sent JSON
  // without the content type, so parse it rather than reject a real request.
  let payload: unknown = req.body
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return res.status(400).json({ error: 'Malformed request body' })
    }
  }

  // Answer a bot exactly as we answer a person. Telling it that the decoy
  // was spotted only teaches whoever wrote it to stop filling that field in.
  if (isBotSubmission(payload)) {
    return res.status(200).json({ ok: true })
  }

  const result = validateDemoRequest(payload)
  if (!result.ok) {
    return res.status(400).json({ error: 'Invalid request', fields: result.errors })
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  if (!user || !pass) {
    console.error('api/demo: SMTP_USER or SMTP_PASSWORD is not set — dropping demo request')
    return res.status(500).json({ error: 'Email is not configured' })
  }

  const port = Number(process.env.SMTP_PORT ?? DEFAULT_PORT)
  const { subject, text } = buildNotificationEmail(result.value)

  try {
    const transport = createTransport({
      host: process.env.SMTP_HOST ?? DEFAULT_HOST,
      port,
      secure: port === 465, // 465 is implicit TLS; 587 upgrades via STARTTLS
      auth: { user, pass },
    })

    await transport.sendMail({
      // Google rewrites From to the authenticated mailbox regardless, so
      // this only controls the display name that shows up in the inbox.
      from: `MadisonAIClinic booking <${user}>`,
      to: DEMO_EMAIL,
      subject,
      text,
      // Only when they gave us an address — replying to a phone number
      // would bounce. With it set, hitting reply answers the lead directly.
      ...(result.value.contactMethod === 'email' ? { replyTo: result.value.contact } : {}),
    })
  } catch (error) {
    console.error('api/demo: SMTP send failed', error)
    return res.status(502).json({ error: 'Could not send the request' })
  }

  return res.status(200).json({ ok: true })
}
