import { Slot } from './Slot'

export function Pricing() {
  return (
    <section className="pricing">
      <div className="pricing-head">
        <span className="kicker">What it costs</span>
        <h2>One flat rate per project. We get it done.</h2>
      </div>

      <div className="pricing-body">
        <div className="pricing-row">
          <h3>The project</h3>
          {/* TODO: confirm the flat project rate. One number, agreed before
              work starts — not a range, not an hourly. */}
          <Slot>TODO — the flat project rate, e.g. $X.</Slot>
          <p>
            One number, agreed before anything is built. It does not move
            because the work took longer than we thought. That risk is ours, not
            yours.
          </p>
        </div>

        <div className="pricing-row">
          <h3>Monthly support</h3>
          {/* TODO: confirm the monthly figure, and whether it is flat per
              business or scales with the number of automations supported. */}
          <Slot>TODO — the monthly support figure, e.g. $X per month.</Slot>
          <p>
            The check-in, the adjustments, and the number that answers. Month to
            month. Stop whenever it stops earning its keep.
          </p>
        </div>
      </div>
    </section>
  )
}
