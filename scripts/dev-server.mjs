/**
 * Local server: `public/` as static files, plus the one serverless function.
 *
 * Vercel runs `api/score.js` in production; this stands in for it so the form
 * can be tested end to end on a laptop with the same code path. Reads .env if
 * one is there, because the SMTP credentials never belong in the repo.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../public/', import.meta.url))
const port = Number(process.env.PORT ?? 5173)

const envFile = fileURLToPath(new URL('../.env', import.meta.url))
if (existsSync(envFile)) {
  const text = await readFile(envFile, 'utf8')
  for (const line of text.split('\n')) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

/** Minimal stand-in for the bits of the Vercel response object we use. */
function wrap(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
    return res
  }
  return res
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (raw === '') return {}
  if ((req.headers['content-type'] ?? '').includes('application/json')) {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  return Object.fromEntries(new URLSearchParams(raw))
}

const server = createServer(async (req, res) => {
  wrap(res)
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (url.pathname === '/api/score') {
    req.body = await readBody(req)
    const { default: handler } = await import('../api/score.js')
    try {
      await handler(req, res)
    } catch (error) {
      console.error(error)
      if (!res.writableEnded) res.status(500).json({ error: 'Handler threw' })
    }
    return
  }

  const path = url.pathname === '/' ? '/index.html' : url.pathname
  let file = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ''))

  // Mirrors vercel.json's cleanUrls: true, so `/products` resolves to
  // `products.html` locally the same way it does once deployed.
  if (!extname(file) && !existsSync(file) && existsSync(`${file}.html`)) {
    file = `${file}.html`
  }

  if (!file.startsWith(root) || !existsSync(file)) {
    res.status(404)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Not found')
    return
  }

  res.setHeader('Content-Type', TYPES[extname(file)] ?? 'application/octet-stream')
  res.end(await readFile(file))
})

server.listen(port, () => console.log(`http://localhost:${port}`))
