import { auth } from '@/auth'
import { redirect } from 'next/navigation'

// Use in Server Components: const session = await requireAuth()
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return session
}

// Use in Server Components for admin/consultant-only pages
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const role = session.user.role
  if (role !== 'ADMIN' && role !== 'CONSULTANT') redirect('/dashboard')
  return session
}

// Use in API routes
export async function getSessionOrThrow() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}
