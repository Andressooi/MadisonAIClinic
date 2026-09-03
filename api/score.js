import { createTransport } from 'nodemailer'
import {
  buildNotificationEmail,
  isBotSubmission,
  validateScoreRequest,
} from '../public/lib/scoreRequest.js'

/**
 * Receives a request for a report from the form and emails it to the clinic.
 *
 * Sends over SMTP through the clinic's own Google Workspace mailbox rather than
 * an email API, so no third party ever holds the leads. Deliverability rules
 * (SPF, DKIM, a warmed domain) are not a concern here: this is our own mail
 * server delivering to our own inbox, not outbound mail to strangers.
 *
 * The whole reason this project exists is a business whose contact form
 * silently discarded every lead for months, so this handler never answers
 * "sent" unless the mail server actually accepted the message.
 *
 * Environment (Vercel project settings):
 *   SMTP_USER      required — the mailbox, e.g. hello@madisonaiclinic.com
 *   SMTP_PASSWORD  required — a Google app password, not the account password
 *   REPORT_EMAIL   optional — where requests land; defaults to SMTP_USER
 *   SMTP_HOST      optional — defaults to Gmail
 *   SMTP_PORT      optional — defaults to 465 (implicit TLS)
 */

const DEFAULT_HOST = 'smtp.gmail.com'
const DEFAULT_PORT = 465

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vercel parses a JSON body for us; a string body means a client sent JSON
  // without the content type, so parse it rather than reject a real request.
  let payload = req.body
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return res.status(400).json({ error: 'Malformed request body' })
    }
  }

  // Answer a bot exactly as we answer a person. Telling it the decoy was
  // spotted only teaches whoever wrote it to stop filling that field in.
  if (isBotSubmission(payload)) {
    return res.status(200).json({ ok: true })
  }

  const result = validateScoreRequest(payload)
  if (!result.ok) {
    return res.status(400).json({ error: 'Invalid request', fields: result.errors })
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  if (!user || !pass) {
    console.error('api/score: SMTP_USER or SMTP_PASSWORD is not set — dropping a request')
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
      // Google rewrites From to the authenticated mailbox regardless, so this
      // only sets the display name that shows up in the inbox.
      from: `Madison AI Clinic <${user}>`,
      to: process.env.REPORT_EMAIL ?? user,
      replyTo: result.value.email,
      subject,
      text,
    })
  } catch (error) {
    console.error('api/score: SMTP send failed', error)
    return res.status(502).json({ error: 'Could not send the request' })
  }

  return res.status(200).json({ ok: true })
}
