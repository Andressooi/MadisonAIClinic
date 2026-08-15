import { Logo } from './Logo'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="footer-brand">
        <Logo size={16} />
        <span>Madison, Wisconsin</span>
      </span>
      <span>Contact details to come</span>
    </footer>
  )
}
