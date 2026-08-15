# MadisonAIClinic

Marketing site for MadisonAIClinic — AI automation setup, training and support
for small businesses in Madison, Wisconsin.

Built from the Claude Design canvas `MadisonAIClinic Site.dc.html` (direction 1B,
"split index") on the Modernist design system. Tokens and component classes live
in `src/styles/`.

```sh
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm test         # vitest, 100% coverage enforced — see TESTING.md
```

## Demo booking

Every "Schedule a demo" CTA anchors to `#demo`, the closing section, which holds
the one booking form on the site. The form POSTs to `api/demo.ts`, a Vercel
serverless function that emails the request to `demo@madisonaiclinic.com`.
Validation and message-building live in `src/lib/demoRequest.ts` so the browser
and the function apply the same rules.

Mail goes out over SMTP through the clinic's own Google Workspace mailbox, not
an email API — no third party handles the leads, and there are no DNS records
to set up. SPF/DKIM reputation does not matter here because this is our own
server delivering to our own inbox, not outbound mail to strangers.

Environment variables on the Vercel project:

| Variable        | Required | Notes                                                                      |
| --------------- | -------- | -------------------------------------------------------------------------- |
| `SMTP_USER`     | yes      | The mailbox, e.g. `demo@madisonaiclinic.com`.                               |
| `SMTP_PASSWORD` | yes      | A Google **app password** (needs 2FA on the account), not the login password.|
| `SMTP_HOST`     | no       | Defaults to `smtp.gmail.com`.                                               |
| `SMTP_PORT`     | no       | Defaults to `465`. Port 587 switches to STARTTLS automatically.             |

Without the two required vars the function returns 500 and the form falls back
to a mailto link, so a lead is never silently lost.

`npm run dev` serves the client only — Vite does not run the function, so
submitting locally always lands on the "that didn't send" fallback. Use
`vercel dev` to exercise the real endpoint.
