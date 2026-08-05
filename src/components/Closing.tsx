import { DEMO_HREF } from '../lib/demo'

export function Closing() {
  return (
    <section className="closing">
      <h2 className="headline">
        See what it does
        <br /> before you spend a dollar.
      </h2>
      <a className="btn btn-primary" href={DEMO_HREF}>
        Schedule a demo
      </a>
    </section>
  )
}
