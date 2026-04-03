import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import type {
  InitiativeRow,
  SystemChangeRow,
  DashboardStats,
  TabCounts,
} from '@/lib/dashboard-types'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatCards from '@/components/dashboard/StatCards'
import StatusLegend from '@/components/dashboard/StatusLegend'
import WorkstreamTabs from '@/components/dashboard/WorkstreamTabs'
import '@/styles/dashboard.css'

export default async function DashboardPage() {
  const session = await requireAuth()
  const clientId = session.user.clientId

  // ── Fetch all data in parallel ──────────────────────────────────────────────
  const [client, initiatives, systemChangesRaw] = await Promise.all([
    prisma.client.findUnique({ where: { id: clientId } }),
    prisma.initiative.findMany({
      where: { clientId },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.systemChange.findMany({
      where: { clientId },
      include: {
        initiatives: {
          include: { initiative: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // ── Serialize initiatives ───────────────────────────────────────────────────
  const initiativeRows: InitiativeRow[] = initiatives.map((i) => ({
    id: i.id,
    name: i.name,
    type: i.type,
    workstream: i.workstream,
    status: i.status,
    estBenefitMin: i.estBenefitMin,
    estBenefitMax: i.estBenefitMax,
    benefitLabel: i.benefitLabel,
    volume: i.volume,
    systemFlag: i.systemFlag,
    notes: i.notes,
  }))

  // ── Serialize system changes ────────────────────────────────────────────────
  const systemChangeRows: SystemChangeRow[] = systemChangesRaw.map((sc) => ({
    id: sc.id,
    title: sc.title,
    impactSummary: sc.impactSummary,
    recommendedAction: sc.recommendedAction,
    status: sc.status,
    affectedInitiatives: sc.initiatives.map((link) => link.initiative.name),
  }))

  // ── Calculate stats ─────────────────────────────────────────────────────────
  const stats: DashboardStats = {
    rpaBots: initiatives.filter((i) => i.type === 'RPA_BOT').length,
    processImprovements: initiatives.filter((i) => i.type === 'PIR').length,
    dashboards: initiatives.filter((i) => i.type === 'DASHBOARD').length,
    systemChanges: systemChangesRaw.length,
  }

  // ── Calculate tab counts ────────────────────────────────────────────────────
  const tabCounts: TabCounts = {
    all: initiatives.length,
    consumer: initiatives.filter((i) => i.workstream === 'CONSUMER').length,
    commercial: initiatives.filter((i) => i.workstream === 'COMMERCIAL_SB').length,
    backOffice: initiatives.filter((i) => i.workstream === 'BACK_OFFICE').length,
    loanServicing: initiatives.filter((i) => i.workstream === 'LOAN_SERVICING').length,
    executive: initiatives.filter((i) => i.workstream === 'EXECUTIVE' || i.workstream === 'ALL').length,
    systemChanges: systemChangesRaw.length,
  }

  // ── Format date ─────────────────────────────────────────────────────────────
  const asOfDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="dash-page">
      <DashboardHeader
        clientName={client?.name ?? 'Client Portal'}
        asOfDate={asOfDate}
      />
      <StatCards stats={stats} />
      <StatusLegend />
      <WorkstreamTabs
        initiatives={initiativeRows}
        systemChanges={systemChangeRows}
        tabCounts={tabCounts}
      />
      <div className="dash-footer">
        Prepared by The Lab Consulting &nbsp;·&nbsp; {client?.name}, Project 26.195.02 &nbsp;·&nbsp; {asOfDate}
      </div>
    </div>
  )
}
