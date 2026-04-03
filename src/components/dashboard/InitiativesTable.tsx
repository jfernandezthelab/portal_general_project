import type {
  InitiativeRow,
  InitiativeType,
} from '@/lib/dashboard-types'
import {
  STATUS_CONFIG,
  TYPE_CONFIG,
  WORKSTREAM_LABELS,
  SYSTEM_FLAG_LABELS,
  TYPE_SECTION_HEADERS,
} from '@/lib/dashboard-types'
import SectionHeader from './SectionHeader'

interface InitiativesTableProps {
  initiatives: InitiativeRow[]
  /** "all" shows Workstream column; a specific workstream shows Type column */
  mode: 'all' | 'workstream'
}

function InitiativeTableForType({
  items,
  type,
  mode,
}: {
  items: InitiativeRow[]
  type: InitiativeType
  mode: 'all' | 'workstream'
}) {
  if (items.length === 0) return null
  const header = TYPE_SECTION_HEADERS[type]

  return (
    <div className="section">
      <SectionHeader icon={header.icon} title={header.title} />
      <table className="dash-table">
        <thead>
          <tr>
            <th style={{ width: '27%' }}>Initiative</th>
            <th style={{ width: mode === 'all' ? '12%' : '10%' }}>
              {mode === 'all' ? 'Workstream' : 'Type'}
            </th>
            <th style={{ width: '13%' }}>Status</th>
            <th>Notes / System Impact</th>
          </tr>
        </thead>
        <tbody>
          {items.map((init) => {
            const statusCfg = STATUS_CONFIG[init.status]
            const typeCfg = TYPE_CONFIG[init.type]
            const sysLabel = SYSTEM_FLAG_LABELS[init.systemFlag]

            return (
              <tr key={init.id}>
                {/* Initiative name + system warning */}
                <td>
                  <div className="name">{init.name}</div>
                  {init.volume && <div className="note">{init.volume}</div>}
                  {sysLabel && (
                    <div className="warn">⚠ SYS: {sysLabel}</div>
                  )}
                </td>

                {/* Workstream or Type column */}
                <td>
                  {mode === 'all' ? (
                    WORKSTREAM_LABELS[init.workstream]
                  ) : (
                    <span className={`type-badge ${typeCfg.className}`}>
                      {typeCfg.label}
                    </span>
                  )}
                </td>

                {/* Status badge + optional sys flag */}
                <td>
                  <span className={`badge ${statusCfg.className}`}>
                    {statusCfg.label}
                  </span>
                  {sysLabel && (
                    <>
                      <br />
                      <span className="sys-flag">{sysLabel}</span>
                    </>
                  )}
                </td>

                {/* Notes */}
                <td>
                  {init.benefitLabel && <>{init.benefitLabel}. </>}
                  {init.notes}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function InitiativesTable({ initiatives, mode }: InitiativesTableProps) {
  const typeOrder: InitiativeType[] = ['RPA_BOT', 'PIR', 'DASHBOARD']

  return (
    <>
      {typeOrder.map((type) => {
        const items = initiatives.filter((i) => i.type === type)
        return (
          <InitiativeTableForType
            key={type}
            items={items}
            type={type}
            mode={mode}
          />
        )
      })}
    </>
  )
}
