// Injects the fully-rendered app markup into dist/index.html after build,
// so crawlers that don't execute JavaScript (many AI/LLM bots included)
// see real content instead of an empty <div id="root">.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const { render } = await import(path.join(projectRoot, 'dist-ssr', 'entry-server.js'))
const appHtml = render()

const indexPath = path.join(projectRoot, 'dist', 'index.html')
const html = readFileSync(indexPath, 'utf-8')

if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find an empty <div id="root"></div> in dist/index.html')
}

writeFileSync(indexPath, html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`))
rmSync(path.join(projectRoot, 'dist-ssr'), { recursive: true, force: true })

console.log('prerender: injected app markup into dist/index.html')
