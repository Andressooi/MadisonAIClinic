import { CONSULT_HREF } from '../lib/consult'

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
      <a className="btn btn-primary" href={CONSULT_HREF}>
        Book a free consult
      </a>
    </nav>
  )
}
