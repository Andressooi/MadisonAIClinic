import { Slot } from './Slot'

export function Pricing() {
  return (
    <section className="pricing">
      <div className="pricing-head">
        <span className="kicker">What it costs</span>
        <h2>Two numbers, and you get both in writing before you decide.</h2>
      </div>

      <div className="pricing-body">
        <div className="pricing-row">
          <h3>Setup</h3>
          {/* TODO: confirm the setup range. A one-off project fee, quoted after
              the consult and fixed before any work starts. */}
          <Slot>TODO — setup range, e.g. $X to $Y for a typical engagement.</Slot>
          <p>
            A fixed project fee, quoted in the consult document and agreed
            before anything is built.
          </p>
        </div>

        <div className="pricing-row">
          <h3>Monthly support</h3>
          {/* TODO: confirm the monthly range, and whether it is per business or
              scales with the number of automations under support. */}
          <Slot>TODO — monthly range, e.g. $X to $Y per month.</Slot>
          <p>
            The check-in, the adjustments, and the number that answers. Month to
            month. Stop whenever it stops earning its keep.
          </p>
        </div>
      </div>
    </section>
  )
}
