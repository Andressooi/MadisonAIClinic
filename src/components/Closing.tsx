import { CONSULT_HREF } from '../lib/consult'

export function Closing() {
  return (
    <section className="closing">
      <h2 className="headline">
        Start with the ninety
        <br /> minutes that cost nothing.
      </h2>
      <a className="btn btn-primary" href={CONSULT_HREF}>
        Book a free consult
      </a>
    </section>
  )
}
