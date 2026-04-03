import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import {
  PrismaClient,
  UserRole,
  ProjectStatus,
  InitiativeType,
  InitiativeStatus,
  Workstream,
  SystemFlag,
  MilestoneStatus,
  SprintStatus,
  ChangeStatus,
} from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // ── Create demo client: Peak CU ────────────────────────────────────────────
  const peakCu = await prisma.client.create({
    data: {
      name: 'Peak Credit Union',
      industry: 'Credit Union',
      contactName: 'Sarah Mitchell',
      contactEmail: 'smitchell@peakcu.com',
    },
  })
  console.log('✅ Client:', peakCu.name)

  // ── Create admin user ──────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thelab.com' },
    update: {},
    create: {
      email: 'admin@thelab.com',
      passwordHash: adminPassword,
      name: 'Lab Admin',
      role: UserRole.ADMIN,
      clientId: peakCu.id,
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ── Create client viewer user ──────────────────────────────────────────────
  const clientPassword = await bcrypt.hash('peakcu123', 12)
  const clientUser = await prisma.user.upsert({
    where: { email: 'portal@peakcu.com' },
    update: {},
    create: {
      email: 'portal@peakcu.com',
      passwordHash: clientPassword,
      name: 'Peak CU Portal',
      role: UserRole.CLIENT_VIEWER,
      clientId: peakCu.id,
    },
  })
  console.log('✅ Client user:', clientUser.email)

  // ── Settings ───────────────────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { clientId: peakCu.id },
    update: {},
    create: {
      clientId: peakCu.id,
      progress: 47,
      status: ProjectStatus.ON_TRACK,
      totalWeeks: 32,
      lastUpdated: new Date('2026-03-26'),
    },
  })
  console.log('✅ Settings created')

  // ── Initiatives ────────────────────────────────────────────────────────────
  const loanBooking = await prisma.initiative.create({
    data: {
      clientId: peakCu.id,
      name: 'Loan Booking Automation',
      type: InitiativeType.RPA_BOT,
      workstream: Workstream.CONSUMER,
      status: InitiativeStatus.IN_PROGRESS,
      estBenefitMin: 33000,
      estBenefitMax: 86000,
      benefitLabel: '$33K–$86K',
      volume: '480–1,248 units/mo',
      systemFlag: SystemFlag.NONE,
    },
  })

  const loanIntake = await prisma.initiative.create({
    data: {
      clientId: peakCu.id,
      name: 'Consumer Loan Intake Redesign',
      type: InitiativeType.PIR,
      workstream: Workstream.CONSUMER,
      status: InitiativeStatus.IN_PROGRESS,
      estBenefitMin: 45000,
      estBenefitMax: 120000,
      benefitLabel: '$45K–$120K',
      volume: '600–1,500 apps/mo',
      systemFlag: SystemFlag.NONE,
    },
  })

  const memberOnboarding = await prisma.initiative.create({
    data: {
      clientId: peakCu.id,
      name: 'Member Onboarding Portal',
      type: InitiativeType.DASHBOARD,
      workstream: Workstream.BACK_OFFICE,
      status: InitiativeStatus.EARLY_ESTIMATE,
      estBenefitMin: 20000,
      estBenefitMax: 50000,
      benefitLabel: '$20K–$50K',
      systemFlag: SystemFlag.NONE,
    },
  })

  const commercialIntake = await prisma.initiative.create({
    data: {
      clientId: peakCu.id,
      name: 'Commercial Loan Intake',
      type: InitiativeType.PIR,
      workstream: Workstream.COMMERCIAL_SB,
      status: InitiativeStatus.CLIENT_READY,
      estBenefitMin: 55000,
      estBenefitMax: 140000,
      benefitLabel: '$55K–$140K',
      volume: '120–300 apps/mo',
      systemFlag: SystemFlag.SYS_IMPACT,
      notes: 'Pending MeridianLink migration',
    },
  })

  const execDashboard = await prisma.initiative.create({
    data: {
      clientId: peakCu.id,
      name: 'Executive KPI Dashboard',
      type: InitiativeType.DASHBOARD,
      workstream: Workstream.EXECUTIVE,
      status: InitiativeStatus.IN_PROGRESS,
      systemFlag: SystemFlag.NONE,
    },
  })

  console.log('✅ 5 Initiatives created')

  // ── KPIs (tied to initiatives) ─────────────────────────────────────────────
  const kpis = [
    { initiativeId: loanBooking.id, label: 'Pull-through rate', value: '68%', unit: '%', category: 'throughput' },
    { initiativeId: loanBooking.id, label: 'Avg booking time', value: '4.2 min', unit: 'min', category: 'capacity' },
    { initiativeId: loanIntake.id, label: 'Application completion rate', value: '74%', unit: '%', category: 'quality' },
    { initiativeId: loanIntake.id, label: 'Time to decision', value: '2.1 days', unit: 'days', category: 'throughput' },
    { initiativeId: commercialIntake.id, label: 'Docs collected digitally', value: '42%', unit: '%', category: 'quality' },
    { initiativeId: execDashboard.id, label: 'Reports automated', value: '3', unit: null, category: 'capacity' },
  ]
  for (const kpi of kpis) {
    await prisma.kpi.create({ data: { ...kpi, clientId: peakCu.id } })
  }
  console.log('✅ 6 KPIs created')

  // ── Milestones ─────────────────────────────────────────────────────────────
  const milestones = [
    { title: 'Project Kickoff',       status: MilestoneStatus.COMPLETE,     dueDate: new Date('2026-01-06'), completedAt: new Date('2026-01-06') },
    { title: 'Phase 1 Complete',      status: MilestoneStatus.COMPLETE,     dueDate: new Date('2026-02-03'), completedAt: new Date('2026-02-03') },
    { title: 'Phase 2 Complete',      status: MilestoneStatus.COMPLETE,     dueDate: new Date('2026-03-17'), completedAt: new Date('2026-03-17') },
    { title: 'Phase 3 Delivery',      status: MilestoneStatus.IN_PROGRESS,  dueDate: new Date('2026-05-12'), completedAt: null },
    { title: 'Go-Live',              status: MilestoneStatus.PENDING,      dueDate: new Date('2026-08-25'), completedAt: null },
    // Initiative-level milestones
    { title: 'Loan Booking UAT',     status: MilestoneStatus.IN_PROGRESS,  dueDate: new Date('2026-04-15'), completedAt: null, initiativeId: loanBooking.id },
    { title: 'Intake Form Launch',   status: MilestoneStatus.PENDING,      dueDate: new Date('2026-05-01'), completedAt: null, initiativeId: loanIntake.id },
  ]
  for (const ms of milestones) {
    await prisma.milestone.create({
      data: {
        clientId: peakCu.id,
        title: ms.title,
        status: ms.status,
        dueDate: ms.dueDate,
        completedAt: ms.completedAt,
        initiativeId: ms.initiativeId ?? null,
      },
    })
  }
  console.log('✅ 7 Milestones created')

  // ── Sprints ────────────────────────────────────────────────────────────────
  const sprints = [
    { sprintNumber: 13, startDate: new Date('2026-03-10'), endDate: new Date('2026-03-23'), status: SprintStatus.COMPLETE, goals: 'Loan booking bot v1 deployed' },
    { sprintNumber: 14, startDate: new Date('2026-03-24'), endDate: new Date('2026-04-06'), status: SprintStatus.ACTIVE,   goals: 'Loan intake redesign + booking UAT' },
    { sprintNumber: 15, startDate: new Date('2026-04-07'), endDate: new Date('2026-04-20'), status: SprintStatus.PLANNED,  goals: 'Member onboarding portal kickoff' },
    { sprintNumber: 16, startDate: new Date('2026-04-21'), endDate: new Date('2026-05-04'), status: SprintStatus.PLANNED,  goals: 'Commercial intake + exec dashboard' },
  ]
  for (const sprint of sprints) {
    await prisma.sprint.create({ data: { ...sprint, clientId: peakCu.id } })
  }
  console.log('✅ 4 Sprints created')

  // ── System Changes ─────────────────────────────────────────────────────────
  const meridianLink = await prisma.systemChange.create({
    data: {
      clientId: peakCu.id,
      title: 'Origence → MeridianLink Migration',
      impactSummary: 'LOS platform switch affects all loan-related automations. API endpoints and data mappings will change.',
      recommendedAction: 'Pause commercial loan intake bot until new API specs are finalized. Continue consumer-side work on current platform.',
      status: ChangeStatus.ACTIVE,
    },
  })

  // Link system change to affected initiatives
  await prisma.initiativeSystemChange.create({
    data: { initiativeId: commercialIntake.id, systemChangeId: meridianLink.id },
  })
  await prisma.initiativeSystemChange.create({
    data: { initiativeId: loanBooking.id, systemChangeId: meridianLink.id },
  })
  console.log('✅ 1 System Change created (linked to 2 initiatives)')

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
