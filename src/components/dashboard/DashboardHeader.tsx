interface DashboardHeaderProps {
  clientName: string
  asOfDate: string
}

export default function DashboardHeader({ clientName, asOfDate }: DashboardHeaderProps) {
  return (
    <div className="dash-header">
      <h1>{clientName} — In-Flight Initiatives Status</h1>
      <div className="sub">
        Project 26.195.02 &nbsp;·&nbsp; As of {asOfDate} &nbsp;·&nbsp; Sources: Phase II Punchlist, Benefits Tracker, Workstream Transcripts &amp; Group Chat &nbsp;·&nbsp; Prepared by The Lab Consulting
      </div>
    </div>
  )
}
