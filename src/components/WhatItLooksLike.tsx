const TRANSFORMATIONS = [
  {
    trade: 'Quoting',
    before:
      'A quote takes two days. Measure on site, price it at the kitchen table that night, type it up, send it Thursday.',
    after:
      'It goes out in ten minutes, while the customer is still on the phone.',
    how: 'An agent that reads your price list and your past jobs, drafts the quote in your format, and holds it until you approve it.',
  },
  {
    trade: 'Intake',
    before:
      'The intake packet eats a paralegal’s morning. Forms, notes, the file, the checklist, all of it typed twice.',
    after: 'It is drafted before the client leaves the parking lot.',
    how: 'An agent that turns the form and the meeting notes into a first draft: file summary, checklist, next steps. Nothing leaves the office without your review.',
  },
  {
    trade: 'Reporting',
    before:
      'The grant report costs a weekend. The volunteer schedule costs a Sunday night, every month.',
    after: 'The report takes an hour. The schedule builds itself.',
    how: 'An agent that pulls the numbers from where they already live, writes the narrative in last year’s format, and fills the shifts against the availability you already collect.',
  },
]

const MODEL = [
  {
    title: 'Setup',
    body: 'We build it in the tools you already pay for, in your building, and it runs before we leave.',
  },
  {
    title: 'Training',
    body: 'Your people, your machines, your actual work. When we are done, the front desk can change it without calling us.',
  },
  {
    title: 'Support',
    body: 'A monthly check-in, a number that answers, and adjustments as the tools and the business move.',
  },
]

export function WhatItLooksLike() {
  return (
    <section className="work" id="what-it-looks-like">
      <span className="kicker">What it looks like</span>
      <h2 className="work-head">
        Three jobs, before and after. These are the shapes the work usually
        takes.
      </h2>

      <div className="work-grid">
        {TRANSFORMATIONS.map((item) => (
          <article key={item.trade} className="work-card">
            <h3 className="work-trade">{item.trade}</h3>
            <dl className="work-swap">
              <dt>Today</dt>
              <dd>{item.before}</dd>
              <dt>After</dt>
              <dd className="work-after">{item.after}</dd>
            </dl>
            <p className="work-how">{item.how}</p>
          </article>
        ))}
      </div>

      <div className="model">
        <span className="kicker">How it gets there</span>
        <div className="model-grid">
          {MODEL.map((step) => (
            <div key={step.title} className="model-item">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
