import type { DashboardStats } from '@/lib/dashboard-types'

interface StatCardsProps {
  stats: DashboardStats
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="stats">
      <div className="stat-card">
        <div className="num">{stats.rpaBots}</div>
        <div className="lbl">RPA Bots In-Flight</div>
      </div>
      <div className="stat-card">
        <div className="num">{stats.processImprovements}</div>
        <div className="lbl">Process Improvements</div>
      </div>
      <div className="stat-card">
        <div className="num">{stats.dashboards}</div>
        <div className="lbl">Dashboards / Analytics</div>
      </div>
      <div className="stat-card">
        <div className="num danger">{stats.systemChanges}</div>
        <div className="lbl">System Change Impacts</div>
      </div>
    </div>
  )
}
