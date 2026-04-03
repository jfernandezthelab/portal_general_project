import type { SystemChangeRow } from '@/lib/dashboard-types'
import SectionHeader from './SectionHeader'

interface SystemChangesTableProps {
  systemChanges: SystemChangeRow[]
}

export default function SystemChangesTable({ systemChanges }: SystemChangesTableProps) {
  if (systemChanges.length === 0) return null

  return (
    <div className="section">
      <SectionHeader
        icon="🚨"
        title="System Changes Affecting In-Flight Work"
        variant="system"
      />
      <table className="dash-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>System Change</th>
            <th style={{ width: '22%' }}>Affected Initiatives</th>
            <th>Impact &amp; Recommended Action</th>
          </tr>
        </thead>
        <tbody>
          {systemChanges.map((sc) => (
            <tr key={sc.id}>
              <td>
                <strong>{sc.title}</strong>
              </td>
              <td>
                {sc.affectedInitiatives.length > 0
                  ? sc.affectedInitiatives.join(' · ')
                  : '—'}
              </td>
              <td>
                {sc.impactSummary}{' '}
                <strong>Action: {sc.recommendedAction}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
