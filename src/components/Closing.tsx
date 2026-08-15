import { DemoForm } from './DemoForm'

/**
 * The closing section is the booking surface — it owns the `#demo` anchor
 * every "Schedule a demo" CTA points at. The page's last word and its one
 * form are the same block on purpose: a visitor who has read this far should
 * not have to go looking for the thing they just decided to do.
 */
export function Closing() {
  return (
    <section className="closing" id="demo">
      <div className="closing-lede">
        <span className="kicker">Start here</span>
        <h2 className="headline">
          See what it does
          <br /> before you spend a dollar.
        </h2>
        <p>
          Tell us how to reach you and we&rsquo;ll set up a free demo on the
          kind of work you actually do &mdash; quoting, intake, follow-up,
          reporting. Then you decide whether any of it is worth anything to
          you.
        </p>
      </div>
      <DemoForm />
    </section>
  )
}
