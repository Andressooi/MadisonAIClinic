import { DEMO_HREF } from '../lib/demo'

export function SiteNav() {
  return (
    <nav className="nav" aria-label="Primary">
      <span className="nav-brand">MadisonAIClinic</span>
      <div className="nav-links">
        <a href="#the-shift">The shift</a>
        <a href="#why-now">Why now</a>
        <a href="#who-its-for">Who it&rsquo;s for</a>
        <a href="#faq">FAQ</a>
      </div>
      <a className="btn btn-primary" href={DEMO_HREF}>
        Schedule a demo
      </a>
    </nav>
  )
}
