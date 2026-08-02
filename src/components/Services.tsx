import { PhotoSlot } from './PhotoSlot'
import { AgentSample } from './AgentSample'

const SERVICES = [
  {
    title: 'Hands-on setup',
    photo: 'Drop a photo - setup at a counter',
    body: 'We build it in your tools, not in a proposal. Two or three jobs automated properly - quoting, intake, follow-up - and running before we leave the building.',
  },
  {
    title: 'Training',
    photo: 'Drop a photo - staff training session',
    body: 'Your people, your machines, your actual work. The goal is independence: the front desk can change it without calling us.',
  },
  {
    title: 'Ongoing support',
    photo: 'Drop a photo - a Madison storefront',
    body: 'A monthly check-in, a number that answers, and adjustments as the tools and the business move. You do not have to follow the field. We do.',
  },
]

export function Services() {
  return (
    <section className="services" id="services">
      <span className="kicker">What we do</span>
      <div className="services-grid">
        {SERVICES.map((service) => (
          <div key={service.title}>
            <figure className="grayscale">
              <PhotoSlot label={service.photo} />
            </figure>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
          </div>
        ))}
      </div>
      <div className="agent-samples-section">
        <h3>Sample AI Agents for Small Businesses</h3>
        <p>See what is possible - three example agents we deploy to help small companies automate their most time-consuming work:</p>
        <AgentSample />
      </div>
    </section>
  )
}
