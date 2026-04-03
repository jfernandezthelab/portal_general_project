import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { PrismaClient, Role, SprintStatus } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // ── Create admin user (no client) ──────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thelab.com' },
    update: {},
    create: {
      email: 'admin@thelab.com',
      passwordHash: adminPassword,
      name: 'Lab Admin',
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ── Create demo client: Peak CU ────────────────────────────────────────────
  const peakCu = await prisma.client.upsert({
    where: { slug: 'peak-cu' },
    update: {},
    create: {
      name: 'Peak Credit Union',
      slug: 'peak-cu',
      primaryColor: '#2dd4bf',
    },
  })
  console.log('✅ Client:', peakCu.name)

  // ── Create client user for Peak CU ─────────────────────────────────────────
  const clientPassword = await bcrypt.hash('peakcu123', 12)
  const clientUser = await prisma.user.upsert({
    where: { email: 'portal@peakcu.com' },
    update: {},
    create: {
      email: 'portal@peakcu.com',
      passwordHash: clientPassword,
      name: 'Peak CU Portal',
      role: Role.CLIENT,
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
      week: 15,
      totalWeeks: 32,
      lastUpdated: new Date('2026-03-26'),
      status: 'On Track',
    },
  })

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const kpis = [
    { label: 'Solutions Deployed', value: '3',   sub: 'Live in production',    accent: '#2dd4bf', sortOrder: 0 },
    { label: 'In Development',     value: '4',   sub: 'Active sprints',        accent: '#8b5cf6', sortOrder: 1 },
    { label: 'Planned',            value: '6',   sub: 'Roadmap confirmed',     accent: '#f59e0b', sortOrder: 2 },
    { label: 'Staff Trained',      value: '45+', sub: 'Across departments',    accent: '#10b981', sortOrder: 3 },
    { label: 'Time Saved / Wk',    value: '20h+',sub: 'Estimated hrs recovered',accent: '#60a5fa', sortOrder: 4 },
  ]
  for (const kpi of kpis) {
    await prisma.kpi.create({ data: { ...kpi, clientId: peakCu.id } })
  }

  // ── Milestones ─────────────────────────────────────────────────────────────
  const milestones = [
    { label: 'Kickoff',  date: 'Jan 6',  percent: 0,   done: true,  sortOrder: 0 },
    { label: 'Phase 1',  date: 'Feb 3',  percent: 25,  done: true,  sortOrder: 1 },
    { label: 'Phase 2',  date: 'Mar 17', percent: 47,  done: true,  sortOrder: 2 },
    { label: 'Phase 3',  date: 'May 12', percent: 70,  done: false, sortOrder: 3 },
    { label: 'Go-Live',  date: 'Aug 25', percent: 100, done: false, sortOrder: 4 },
  ]
  for (const ms of milestones) {
    await prisma.milestone.create({ data: { ...ms, clientId: peakCu.id } })
  }

  // ── Sprints ────────────────────────────────────────────────────────────────
  const sprints = [
    { weekLabel: 'Week 15', dates: 'Mar 24 – Apr 6', itemName: 'Loan Booking Automation',    dept: 'Lending', status: SprintStatus.IN_PROGRESS, sortOrder: 0 },
    { weekLabel: 'Week 15', dates: 'Mar 24 – Apr 6', itemName: 'Consumer Loan Intake Redesign', dept: 'Lending', status: SprintStatus.IN_PROGRESS, sortOrder: 1 },
    { weekLabel: 'Week 17', dates: 'Apr 7 – Apr 20', itemName: 'Member Onboarding Portal',   dept: 'Digital', status: SprintStatus.NEXT_UP, sortOrder: 2 },
  ]
  for (const sprint of sprints) {
    await prisma.sprint.create({ data: { ...sprint, clientId: peakCu.id } })
  }

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
