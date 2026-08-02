export function Hero() {
  return (
    <section className="hero">
      <div className="hero-lede">
        <h1 className="headline">
          AI automation,
          <br /> installed on your
          <br /> side of the counter.
        </h1>
        <p>
          A Madison practice for small businesses: we set up Claude and the
          automation around it, train your staff on it, and support it every
          month after. Setup, training, support &mdash; that&rsquo;s the whole
          offer.
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
