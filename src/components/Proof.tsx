import { Slot } from './Slot'

export function Proof() {
  return (
    <section className="proof">
      <span className="kicker">One we have done</span>
      {/*
        TODO: replace with one real engagement — the business (with permission),
        what we automated, and what changed, in the owner's own words if they
        will give them. One is enough. Do not add logos, ratings, or numbers we
        cannot source. Delete this section entirely rather than ship it empty.
      */}
      <Slot>
        TODO — one real client result: who they are, what we automated, what
        changed. Needs the client's permission before it goes here.
      </Slot>
    </section>
  )
}
