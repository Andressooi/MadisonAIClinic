/**
 * Regenerates public/og-image.png from scripts/og-image.html.
 *
 * Rendered rather than drawn so the card uses the same webfonts and tokens as
 * the page. Needs Chrome and a network connection for the fonts.
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const source = process.env.OG_URL ?? new URL('./og-image.html', import.meta.url).href
const out = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.png')

execFileSync(CHROME, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1200,630',
  `--screenshot=${out}`,
  '--virtual-time-budget=6000',
  source,
], { stdio: 'ignore' })

const dest = fileURLToPath(new URL('../public/og-image.png', import.meta.url))
copyFileSync(out, dest)
console.log(`wrote ${dest}`)
