import { requireAdmin } from '@/lib/auth-helpers'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-gray-400">Coming in Phase 5</p>
      </div>
    </div>
  )
}