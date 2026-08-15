import { DEMO_HREF } from '../lib/demo'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-lede">
        <h1 className="headline">
          For forty years,
          <br /> technology has
          <br /> favored large corporations.
          <br /> AI levels the playing field.
        </h1>
        <p>
          AI puts a corporate back office inside a two-person shop, at a price a
          two-person shop can pay. We are a Madison practice that installs it,
          on your side of the counter.
        </p>
      </div>

      <div className="hero-panel">
        <div>
          <span className="kicker">Start here</span>
          <h2>A free demo</h2>
          <p className="hero-panel-body">
            See how AI can improve your business. We show you the tools running
            on the kind of work you do &mdash; quoting, intake, follow-up,
            reporting &mdash; and what they produce. Then you decide whether any
            of it is worth anything to you.
          </p>
        </div>
        <div className="hero-panel-cta">
          <a className="btn btn-primary btn-block" href={DEMO_HREF}>
            Schedule a demo
          </a>
          <p className="hero-panel-note">
            Madison and Dane County. No cost, no obligation.
          </p>
        </div>
      </div>
    </section>
  )
}
