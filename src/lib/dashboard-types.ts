// Plain types for dashboard data — safe to import in client components
// (avoids importing Prisma runtime code in the browser)

export type InitiativeType = 'RPA_BOT' | 'PIR' | 'DASHBOARD'
export type InitiativeStatus = 'IN_PROGRESS' | 'CLIENT_READY' | 'EARLY_ESTIMATE' | 'DE_PRIORITIZED'
export type WorkstreamEnum = 'CONSUMER' | 'COMMERCIAL_SB' | 'BACK_OFFICE' | 'LOAN_SERVICING' | 'EXECUTIVE' | 'ALL'
export type SystemFlagEnum = 'NONE' | 'SYS_IMPACT' | 'SYS_BLOCKED' | 'ORG_CHANGE'
export type ChangeStatusEnum = 'ACTIVE' | 'RESOLVED' | 'MONITORING'

export interface InitiativeRow {
  id: string
  name: string
  type: InitiativeType
  workstream: WorkstreamEnum
  status: InitiativeStatus
  estBenefitMin: number | null
  estBenefitMax: number | null
  benefitLabel: string | null
  volume: string | null
  systemFlag: SystemFlagEnum
  notes: string | null
}

export interface SystemChangeRow {
  id: string
  title: string
  impactSummary: string
  recommendedAction: string
  status: ChangeStatusEnum
  affectedInitiatives: string[] // initiative names
}

export interface DashboardStats {
  rpaBots: number
  processImprovements: number
  dashboards: number
  systemChanges: number
}

export interface TabCounts {
  all: number
  consumer: number
  commercial: number
  backOffice: number
  loanServicing: number
  executive: number
  systemChanges: number
}

// ── Display mappings ────────────────────────────────────────────

export const STATUS_CONFIG: Record<InitiativeStatus, { label: string; className: string }> = {
  IN_PROGRESS:    { label: 'In Progress',    className: 'b-ip' },
  CLIENT_READY:   { label: 'Client Ready',   className: 'b-cr' },
  EARLY_ESTIMATE: { label: 'Early Estimate', className: 'b-ee' },
  DE_PRIORITIZED: { label: 'De-Prioritized', className: 'b-dp' },
}

export const TYPE_CONFIG: Record<InitiativeType, { label: string; className: string }> = {
  RPA_BOT:   { label: 'RPA',  className: 'tp-rpa' },
  PIR:       { label: 'PIR',  className: 'tp-pir' },
  DASHBOARD: { label: 'DASH', className: 'tp-dash' },
}

export const WORKSTREAM_LABELS: Record<WorkstreamEnum, string> = {
  CONSUMER:       'Consumer',
  COMMERCIAL_SB:  'Commercial / SB',
  BACK_OFFICE:    'Back Office',
  LOAN_SERVICING: 'Loan Servicing',
  EXECUTIVE:      'Executive',
  ALL:            'All',
}

export const SYSTEM_FLAG_LABELS: Record<SystemFlagEnum, string> = {
  NONE:        '',
  SYS_IMPACT:  'SYS IMPACT',
  SYS_BLOCKED: 'SYS BLOCKED',
  ORG_CHANGE:  'ORG CHANGE',
}

export const TYPE_SECTION_HEADERS: Record<InitiativeType, { icon: string; title: string }> = {
  RPA_BOT:   { icon: '⚙️', title: 'RPA / Automation Bots' },
  PIR:       { icon: '📋', title: 'Process Improvements (PIRs)' },
  DASHBOARD: { icon: '📊', title: 'Dashboards & Analytics' },
}
