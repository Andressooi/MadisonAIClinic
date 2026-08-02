const FAQS = [
  {
    question: 'What does a MadisonAIClinic engagement include?',
    answer:
      'Three things: hands-on setup, staff training, and ongoing support. We build the automation in your own tools — two or three jobs done properly, such as quoting, intake, or follow-up — train your staff to run it, then check in monthly as the tools and the business move. Setup, training, support: that’s the whole offer.',
  },
  {
    question: 'How much does AI automation cost for a small business?',
    answer:
      'It depends on which jobs we automate first, so we don’t publish a flat rate. Every engagement starts with the free 90-minute consult, which ends in a written estimate of the savings and the cost — yours to keep even if you decide not to go ahead.',
  },
  {
    question: 'What happens during the free consult?',
    answer:
      'Ninety minutes at your business. We watch one real day of work and write down what AI would help with, what it wouldn’t, and what it would cost. There’s no cost, no obligation, and no pitch — if the honest answer is “not much yet,” we say so.',
  },
  {
    question: 'Do I need in-house technical staff to use this?',
    answer:
      'No. Training is built for independence: the goal is that your front desk or staff can change the automation themselves without calling us back.',
  },
  {
    question: 'Which businesses is MadisonAIClinic for?',
    answer:
      'Owner-operators in retail, trades, and restaurants; professional services like law, accounting, and clinics; nonprofits and community organizations; and solo founders. Most engagements find six to twelve hours a week worth automating.',
  },
  {
    question: 'Where do you work?',
    answer: 'Madison and Dane County, Wisconsin, on-site at your business.',
  },
]

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <span className="kicker">Questions</span>
      <h2 id="faq-heading">Frequently asked questions</h2>
      <div className="faq-list">
        {FAQS.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
