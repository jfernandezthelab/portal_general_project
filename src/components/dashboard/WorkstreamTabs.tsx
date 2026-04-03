'use client'

import { useState } from 'react'
import type {
  InitiativeRow,
  SystemChangeRow,
  TabCounts,
  WorkstreamEnum,
} from '@/lib/dashboard-types'
import InitiativesTable from './InitiativesTable'
import SystemChangesTable from './SystemChangesTable'

type TabId = 'all' | 'consumer' | 'commercial' | 'backOffice' | 'loanServicing' | 'executive' | 'systemChanges'

const TAB_DEFS: { id: TabId; label: string; countKey: keyof TabCounts; sys?: boolean }[] = [
  { id: 'all',            label: 'All Workstreams',     countKey: 'all' },
  { id: 'consumer',       label: 'Consumer Lending',    countKey: 'consumer' },
  { id: 'commercial',     label: 'Commercial / SB',     countKey: 'commercial' },
  { id: 'backOffice',     label: 'Back Office',         countKey: 'backOffice' },
  { id: 'loanServicing',  label: 'Loan Servicing',      countKey: 'loanServicing' },
  { id: 'executive',      label: 'Executive / Cross-CU',countKey: 'executive' },
  { id: 'systemChanges',  label: 'System Changes',      countKey: 'systemChanges', sys: true },
]

const TAB_TO_WORKSTREAM: Record<string, WorkstreamEnum> = {
  consumer:      'CONSUMER',
  commercial:    'COMMERCIAL_SB',
  backOffice:    'BACK_OFFICE',
  loanServicing: 'LOAN_SERVICING',
  executive:     'EXECUTIVE',
}

interface WorkstreamTabsProps {
  initiatives: InitiativeRow[]
  systemChanges: SystemChangeRow[]
  tabCounts: TabCounts
}

export default function WorkstreamTabs({
  initiatives,
  systemChanges,
  tabCounts,
}: WorkstreamTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('all')

  // Filter initiatives for the active tab
  function getFilteredInitiatives(): InitiativeRow[] {
    if (activeTab === 'all') return initiatives
    if (activeTab === 'systemChanges') return []

    const workstream = TAB_TO_WORKSTREAM[activeTab]
    return initiatives.filter(
      (i) => i.workstream === workstream || i.workstream === 'ALL'
    )
  }

  const filtered = getFilteredInitiatives()

  return (
    <>
      {/* Tab bar */}
      <div className="tab-bar">
        {TAB_DEFS.map((tab) => {
          const isActive = activeTab === tab.id
          let className = 'tab-btn'
          if (tab.sys) className += ' sys-tab'
          if (isActive) className += ' active'

          return (
            <button
              key={tab.id}
              className={className}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="cnt">{tabCounts[tab.countKey]}</span>
            </button>
          )
        })}
      </div>

      {/* Active panel */}
      {activeTab === 'systemChanges' ? (
        <SystemChangesTable systemChanges={systemChanges} />
      ) : (
        <InitiativesTable
          initiatives={filtered}
          mode={activeTab === 'all' ? 'all' : 'workstream'}
        />
      )}
    </>
  )
}
