import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds prerender App into #root (see scripts/prerender.mjs) so
// crawlers get real markup; hydrate that instead of re-rendering from scratch.
// In dev, #root starts empty, so fall back to a plain client render.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
