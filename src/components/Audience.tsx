const ROWS = [
  {
    business: 'Owner-operators — retail, trades, restaurants',
    automate: 'Quotes, scheduling, no-show follow-up, ordering',
    gives: 'Same-day answers to customers without staying late',
  },
  {
    business: 'Professional services — law, accounting, clinics',
    automate: 'Intake, document summaries, first drafts, records',
    gives: 'Billable hours back; nothing sent without your review',
  },
  {
    business: 'Nonprofits and community orgs',
    automate: 'Grant reporting, donor letters, volunteer scheduling',
    gives: 'Administrative capacity at a fraction of a hire',
  },
  {
    business: 'Solo founders',
    automate: 'Inbox triage, proposals, bookkeeping prep',
    gives: 'The four roles you’re worst at, off your desk',
  },
]

export function Audience() {
  return (
    <section className="audience" id="who-its-for">
      <span className="kicker">Who it&rsquo;s for</span>
      <table className="table audience-table">
        <thead>
          <tr>
            <th style={{ width: '26%' }}>Business</th>
            <th style={{ width: '34%' }}>What we usually automate first</th>
            <th>What it gives back</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.business}>
              <td data-label="Business">{row.business}</td>
              <td data-label="What we usually automate first">{row.automate}</td>
              <td data-label="What it gives back">{row.gives}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
