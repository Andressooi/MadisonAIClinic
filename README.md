# madisonaiclinic.com

One marketing page. Its only job is to get a small-business owner to request a
free diagnostic report about their own business. Built to the spec and the two
reference mockups in `../madisonaiclinic-redesign/`.

## What is here

```
public/            the site, exactly as it ships
  index.html       the page
  styles.css       tokens, fluid type, layout
  main.js          the form's inline validation and success state
  lib/             validation shared by the browser and the serverless function
  og-image.png     rendered from scripts/og-image.html
api/score.js       the form handler — validates, then emails the clinic
scripts/           dev server, page-weight check, OG image builder
test/              unit tests for the validation
```

No framework and no build step: what is in `public/` is what the browser gets.

## Running it

```
npm install
npm run dev          # http://localhost:5173, including /api/score
npm test             # validation unit tests
npm run check:size   # the ~150KB budget from the spec
npm run og           # re-render public/og-image.png (needs Chrome)
```

`npm run dev` reads `.env` if there is one, so a local submission sends real
mail through whatever SMTP credentials are in it. To exercise the form without
emailing anybody, point it at a local SMTP sink:

```
SMTP_HOST=localhost SMTP_PORT=2525 SMTP_USER=test@example.com \
  SMTP_PASSWORD=x REPORT_EMAIL=test@example.com npm run dev
```

## The form

The finding that started this whole project was a business whose contact form
silently discarded every lead for months, so the rule here is absolute: the
success state appears only after the mail server has accepted the message. A
failed send says so, keeps what was typed, and points at the footer address.

- The page works without JavaScript — the form has a real `action` and `method`.
- `public/lib/scoreRequest.js` is the single source of the rules; the browser
  imports it for fast feedback, `api/score.js` imports it because anything can
  POST to a public endpoint.
- `company` is a honeypot. A submission that fills it in gets the same `200` a
  person gets, and no email is sent.

### Environment (Vercel project settings)

| Variable | | |
|---|---|---|
| `SMTP_USER` | required | the mailbox, e.g. `hello@madisonaiclinic.com` |
| `SMTP_PASSWORD` | required | a Google **app password**, not the account password |
| `REPORT_EMAIL` | optional | where requests land; defaults to `SMTP_USER` |
| `SMTP_HOST` | optional | defaults to `smtp.gmail.com` |
| `SMTP_PORT` | optional | defaults to `465` (implicit TLS) |

Never commit these. `.env` is gitignored.

## Deploying

Vercel, zero-config: `vercel.json` serves `public/` as static output and picks
up `api/score.js` as a Node function. There is no build command — nothing is
compiled, so nothing can compile differently in production than it does here.

Relative imports in `api/` must carry an explicit `.js`. Vercel runs the
function under plain Node, which will not resolve an extensionless specifier.

## Two departures from the spec's token list

Both come out of the contrast check `BUILD.md` asks for:

- `--ink-3` is `#6F6656`, not `#7C7263`. The original is 4.13:1 on `--band` and
  4.46:1 on `--paper` — both under AA for text at 10–15px.
- On the dark section, `#7A7264` and `#6B6355` (3.9:1 and 3.1:1) are replaced by
  a single `--dark-ink-3: #8E8676`.

`--ink-4` is unchanged and now appears only on the decorative ordinals beside
list items, which are `aria-hidden` and sit in real `<ol>`s. "p. 05" and the
part-one / part-two qualifiers carry meaning, so they moved to `--ink-3`.

Everything else is the reference: every word of copy matches, at both widths.

## Still needed from the owner

The page ships with these in square brackets, on purpose, and they must not be
invented:

- [ ] `[YOUR NAME]` and the two sentences of bio, in the byline by the form
- [ ] `[YOUR EMAIL]` and `[YOUR PHONE]` in the footer
- [ ] Decide whether to keep the Northside composite or a real, consented example
- [ ] Confirm the five score components match the real rubric
- [ ] Send a real submission through the live form and watch it arrive
