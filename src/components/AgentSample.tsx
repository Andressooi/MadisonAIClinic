interface Agent {
  name: string
  description: string
  capabilities: string[]
  useCase: string
}

const SAMPLE_AGENTS: Agent[] = [
  {
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries, FAQs, and issue triage automatically',
    capabilities: [
      'Answer common questions',
      'Route complex issues to support team',
      'Track request status',
      'Provide instant responses 24/7'
    ],
    useCase: 'Reduces support ticket volume by 60% and improves response time from hours to seconds'
  },
  {
    name: 'Sales Lead Qualifier',
    description: 'Qualifies and scores leads to help your sales team focus on high-value prospects',
    capabilities: [
      'Collect lead information automatically',
      'Score prospects based on fit',
      'Schedule follow-up calls',
      'Send personalized follow-ups'
    ],
    useCase: 'Increases sales team efficiency by 40% and improves conversion rate through better qualification'
  },
  {
    name: 'Invoice & Documentation Assistant',
    description: 'Automates document processing, invoicing, and record-keeping for your business',
    capabilities: [
      'Process invoices automatically',
      'Extract key data from documents',
      'Maintain organized records',
      'Generate reports on demand'
    ],
    useCase: 'Saves 8+ hours per week on admin work and reduces errors in financial documentation'
  }
]

export function AgentSample() {
  return (
    <div className="agent-samples">
      {SAMPLE_AGENTS.map((agent) => (
        <div key={agent.name} className="agent-card">
          <div className="agent-header">
            <h4 className="agent-name">{agent.name}</h4>
          </div>
          <p className="agent-description">{agent.description}</p>
          <div className="agent-capabilities">
            <span className="capabilities-label">Capabilities:</span>
            <ul>
              {agent.capabilities.map((cap) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
          </div>
          <p className="agent-usecase">
            <strong>Impact:</strong> {agent.useCase}
          </p>
        </div>
      ))}
    </div>
  )
}
