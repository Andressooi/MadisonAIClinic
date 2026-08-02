export function Hero() {
  return (
    <section className="hero">
      <div className="hero-lede">
        <h1 className="headline">
          For forty years,
          <br /> technology has
          <br /> favored scale.
          <br /> This one doesn&rsquo;t.
        </h1>
        <p>
          AI puts a corporate back office inside a two-person shop, at a price a
          two-person shop can pay. We are a Madison practice that installs it,
          on your side of the counter.
        </p>
      </div>

      <div className="hero-panel" id="consult">
        <div>
          <span className="kicker">Start here</span>
          <h2>The free consult</h2>
          <p className="hero-panel-body">
            Ninety minutes at your business. We watch one real day of work and
            write down what AI would help with, what it wouldn&rsquo;t, and what
            it would cost. Yours to keep either way.
          </p>
        </div>
        <div className="hero-panel-cta">
          {/* TODO: wire to a scheduler or mailto once contact details exist. */}
          <button type="button" className="btn btn-primary btn-block">
            Book a free consult
          </button>
          <p className="hero-panel-note">
            Madison and Dane County. No cost, no obligation.
          </p>
        </div>
      </div>
    </section>
  )
}
