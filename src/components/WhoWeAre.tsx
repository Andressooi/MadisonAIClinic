import { Slot } from './Slot'

export function WhoWeAre() {
  return (
    <section className="who">
      {/* The shared PhotoSlot component was removed on main; this is the only
          image placeholder left on the site, so it lives here inline. */}
      <figure className="who-photo grayscale">
        {/* TODO: replace with a real photograph. Working, not posed — at a
            client's counter beats a studio headshot. */}
        <div className="photo-slot">
          <span className="photo-slot-label">
            Drop a photo &mdash; the founder, on site
          </span>
        </div>
      </figure>

      <div className="who-body">
        <span className="kicker">Who you are hiring</span>
        {/* TODO: founder name. */}
        <h2>TODO &mdash; name</h2>
        {/*
          TODO: two or three sentences, this length. What you did before this,
          why Madison, and one concrete thing that makes you the person who
          should be standing behind a counter watching someone work. No
          credentials theater. Plain sentences.
        */}
        <Slot>
          TODO — two or three sentences: what you did before this, why Madison,
          and why you are the person to do this work. Keep it plain.
        </Slot>
      </div>
    </section>
  )
}
