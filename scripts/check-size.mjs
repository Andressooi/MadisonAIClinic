/**
 * BUILD.md sets a budget: the built page under ~150KB before images. This is
 * what everything the browser must fetch to render the page actually weighs.
 */
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../public/', import.meta.url))
const BUDGET = 150 * 1024
const COUNTED = new Set(['.html', '.css', '.js'])

let total = 0
const rows = []

async function walk(dir, prefix = '') {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(path, `${prefix}${entry.name}/`)
      continue
    }
    if (!COUNTED.has(entry.name.slice(entry.name.lastIndexOf('.')))) continue
    const { size } = await stat(path)
    total += size
    rows.push([`${prefix}${entry.name}`, size])
  }
}

await walk(root)
rows.sort((a, b) => b[1] - a[1])
for (const [name, size] of rows) console.log(`${String(Math.round(size / 102.4) / 10).padStart(6)} KB  ${name}`)
console.log(`${String(Math.round(total / 102.4) / 10).padStart(6)} KB  total (budget ${BUDGET / 1024} KB)`)

if (total > BUDGET) {
  console.error(`\nOver budget by ${Math.round((total - BUDGET) / 1024)} KB.`)
  process.exit(1)
}
