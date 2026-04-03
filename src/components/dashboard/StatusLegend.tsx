export default function StatusLegend() {
  return (
    <div className="legend">
      <div className="leg-item">
        <div className="leg-dot" style={{ background: '#85b7eb' }} />
        In Progress
      </div>
      <div className="leg-item">
        <div className="leg-dot" style={{ background: '#97c459' }} />
        Client Ready
      </div>
      <div className="leg-item">
        <div className="leg-dot" style={{ background: '#ef9f27' }} />
        Early Estimate
      </div>
      <div className="leg-item">
        <div className="leg-dot" style={{ background: '#b4b2a9' }} />
        De-Prioritized
      </div>
      <div className="leg-item">
        <span className="type-badge tp-rpa">RPA</span>&nbsp;Automation Bot
      </div>
      <div className="leg-item">
        <span className="type-badge tp-pir">PIR</span>&nbsp;Process Improvement
      </div>
      <div className="leg-item">
        <span className="type-badge tp-dash">DASH</span>&nbsp;Dashboard / Analytics
      </div>
      <div className="leg-item">
        <span className="sys-flag-leg">SYS</span>&nbsp;System change impact
      </div>
    </div>
  )
}
