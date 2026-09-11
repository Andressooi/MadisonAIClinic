import { HONEYPOT_FIELD, INTEREST_OPTIONS, validateScoreRequest } from '/lib/scoreRequest.js'

/**
 * The form.
 *
 * The page works without this file: the form has a real action and method, so
 * a browser with no JavaScript posts to the same endpoint. This layer only
 * adds inline validation and the in-place success state.
 *
 * The one rule that matters: the success state appears only after the server
 * has answered 200. A failure says so, plainly, and keeps what was typed.
 */

const form = document.querySelector('#score-form')
if (form) {
  const button = form.querySelector('button[type="submit"]')
  const status = form.querySelector('#form-status')
  const fields = ['interest', 'business', 'website', 'email']
  let sending = false

  // A product card elsewhere on the site can link here with ?interest=<value>
  // so the right option is already picked when the form comes into view.
  const requestedInterest = new URLSearchParams(window.location.search).get('interest')
  if (requestedInterest && INTEREST_OPTIONS.some((option) => option.value === requestedInterest)) {
    form.elements.interest.value = requestedInterest
  }

  const showFieldError = (name, message) => {
    const input = form.elements[name]
    const slot = form.querySelector(`#${name}-error`)
    if (!input || !slot) return
    slot.textContent = message ?? ''
    input.setAttribute('aria-invalid', message ? 'true' : 'false')
    input.setAttribute('aria-describedby', `${name}-error`)
  }

  const clearFieldErrors = () => fields.forEach((name) => showFieldError(name, null))

  const showStatus = (message) => {
    status.replaceChildren()
    if (!message) {
      status.removeAttribute('data-open')
      return
    }
    const box = document.createElement('p')
    box.className = 'form__status--error'
    box.textContent = message
    status.append(box)
    status.setAttribute('data-open', '')
  }

  // Clearing an error as soon as the visitor starts fixing it, rather than
  // making them submit again to find out whether they did.
  fields.forEach((name) => {
    form.elements[name]?.addEventListener('input', () => {
      if (form.elements[name].getAttribute('aria-invalid') === 'true') showFieldError(name, null)
    })
  })

  const succeed = (request) => {
    const panel = document.createElement('div')
    panel.className = 'stack form__sent'

    const heading = document.createElement('h3')
    heading.textContent = 'That is on its way to us.'

    const body = document.createElement('p')
    body.className = 'body'
    body.textContent =
      `We have ${request.business}. Your report goes to ${request.email} in about a week, ` +
      'written by a person. Nothing else happens in between.'

    panel.append(heading, body)
    form.replaceChildren(panel)
    heading.setAttribute('tabindex', '-1')
    heading.focus()
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (sending) return

    const payload = {
      interest: form.elements.interest.value,
      business: form.elements.business.value,
      website: form.elements.website.value,
      email: form.elements.email.value,
      [HONEYPOT_FIELD]: form.elements[HONEYPOT_FIELD]?.value ?? '',
    }

    clearFieldErrors()
    showStatus(null)

    const result = validateScoreRequest(payload)
    if (!result.ok) {
      Object.entries(result.errors).forEach(([name, message]) => showFieldError(name, message))
      form.elements[Object.keys(result.errors)[0]]?.focus()
      return
    }

    sending = true
    button.disabled = true
    const label = button.textContent
    button.textContent = 'Sending…'

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        succeed(result.value)
        return
      }

      // A 400 means the server disagreed with our own check; show it where the
      // visitor can act on it rather than as a generic failure.
      if (response.status === 400) {
        const detail = await response.json().catch(() => ({}))
        const serverErrors = detail.fields ?? {}
        if (Object.keys(serverErrors).length > 0) {
          Object.entries(serverErrors).forEach(([name, message]) => showFieldError(name, message))
          form.elements[Object.keys(serverErrors)[0]]?.focus()
          return
        }
      }

      throw new Error(`Server answered ${response.status}`)
    } catch (error) {
      console.error('Score request failed to send', error)
      showStatus(
        'That did not send, so we have not got it. Nothing you typed is lost — ' +
          'try again, or email the address at the bottom of this page.',
      )
    } finally {
      sending = false
      // On success the button is gone from the document, replaced by the
      // confirmation; there is nothing left to re-enable.
      if (button.isConnected) {
        button.disabled = false
        button.textContent = label
      }
    }
  })
}
