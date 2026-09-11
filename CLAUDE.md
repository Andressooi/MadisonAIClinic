# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

One marketing page (madisonaiclinic.com) whose only job is to get a small-business
owner to submit the score-request form. No framework, no build step: what is in
`public/` is exactly what ships to the browser. Deployed on Vercel as static
output plus a single serverless function.

## Commands

```
npm install
npm run dev          # http://localhost:5173, including /api/score
npm test             # vitest run — all validation unit tests
npm run test:watch   # vitest watch mode
npm run check:size   # enforces the ~150KB page-weight budget (html+css+js)
npm run og           # re-renders public/og-image.png from scripts/og-image.html (needs Chrome)
```

Single test file or case:
```
npx vitest run test/scoreRequest.test.js
npx vitest run -t "catches one that filled the decoy in"
```

`npm run dev` runs `scripts/dev-server.mjs`, which serves `public/` and dynamically
imports `api/score.js` for the one API route so the form can be tested end to end
locally. It reads `.env` if present, so a local submission sends real mail through
whatever SMTP credentials are there. To exercise the form without emailing anyone,
point it at a local SMTP sink instead:
```
SMTP_HOST=localhost SMTP_PORT=2525 SMTP_USER=test@example.com \
  SMTP_PASSWORD=x REPORT_EMAIL=test@example.com npm run dev
```

If a test submission ever does go out through real SMTP (sink not set up, testing
against the deployed site), use a business name like `Test — Claude` or
`Demo — Claude` so it lands in the inbox as obviously fake rather than looking
like a real lead.

## Architecture

- `public/index.html` / `styles.css` / `main.js` — the page. `main.js` only adds
  inline validation and an in-place success state; the `<form>` has a real
  `action="/api/score"` and `method="post"`, so it works with JavaScript disabled.
- `public/lib/scoreRequest.js` — the single source of truth for the request shape,
  field validation, honeypot detection, and the notification email body. Both
  `main.js` (browser, for fast feedback) and `api/score.js` (server, because
  anything can POST to a public endpoint) import from it, so a submission is
  judged by identical rules on both sides of the wire.
- `api/score.js` — the Vercel serverless function. Validates via the shared lib,
  then sends the notification over SMTP (nodemailer) through the clinic's own
  mailbox rather than a third-party email API. It only ever answers `200` after
  the mail server has actually accepted the message — the project exists because
  a business's old contact form silently discarded leads for months, so a false
  "sent" is the one failure mode that isn't allowed.
- `test/scoreRequest.test.js` — unit tests for the shared validation lib.
- `scripts/dev-server.mjs` — minimal local stand-in for Vercel's runtime (static
  file serving + the one function route + reading `.env`).

### The honeypot

The decoy field's `name`/`id` (`HONEYPOT_FIELD` in `scoreRequest.js`) is
deliberately *not* `company` or `organization` — those names match browser/
password-manager autofill heavily enough that a real visitor's browser can
silently fill the trap, causing a genuine submission to get dropped (server
returns the same `200` as a real send, no email goes out, and the visitor sees
the normal success state). The visible `<label>` can still read "Company" as
bot bait; only the field's `name`/`id` needs to dodge autofill heuristics.

### Environment (set in the Vercel project, not just locally)

| Variable | | |
|---|---|---|
| `SMTP_USER` | required | sending mailbox, e.g. `hello@madisonaiclinic.com` |
| `SMTP_PASSWORD` | required | a Google **app password**, not the account password |
| `REPORT_EMAIL` | optional | where requests land; defaults to `SMTP_USER` |
| `SMTP_HOST` | optional | defaults to `smtp.gmail.com` |
| `SMTP_PORT` | optional | defaults to `465` (implicit TLS) |

`.env` is gitignored and only affects local `npm run dev` — it has no effect on
the deployed site. Changing behavior in production requires setting the
variable in the Vercel project's own settings (dashboard or `vercel env`) and
redeploying.

### Deploying

`vercel.json` serves `public/` as static output and picks up `api/score.js` as
a Node function; there is no build command. Relative imports inside `api/`
must carry an explicit `.js` extension — Vercel runs the function under plain
Node, which will not resolve an extensionless specifier (this broke the demo
booking function once; see git history).

### Design tokens

`public/styles.css` intentionally departs from the original design spec's token
list in two places (both documented inline, from a contrast check): `--ink-3`
is `#6F6656` rather than `#7C7263`, and the dark section's two lightest inks are
collapsed into one `--dark-ink-3: #8E8676`. `--ink-4` is unchanged and now used
only for `aria-hidden` decorative ordinals.
