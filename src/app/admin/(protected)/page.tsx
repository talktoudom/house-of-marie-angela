export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'

type SafeCountResult = {
  value: number | null
  ok: boolean
}

async function safeCount(query: Promise<any>, timeoutMs = 5000): Promise<SafeCountResult> {
  try {
    const timeout = new Promise(resolve =>
      setTimeout(() => resolve(null), timeoutMs)
    )

    const result: any = await Promise.race([query, timeout])

    if (!result) {
      return { value: null, ok: false }
    }

    const count = result?.count

    return {
      value: typeof count === 'number' ? count : 0,
      ok: true,
    }
  } catch {
    return { value: null, ok: false }
  }
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [products, orders, unread, subscribers] = await Promise.all([
    safeCount(
      supabase.from('products').select('*', { count: 'exact', head: true })
    ),
    safeCount(
      supabase.from('orders').select('*', { count: 'exact', head: true })
    ),
    safeCount(
      supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)
    ),
    safeCount(
      supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
    ),
  ])

  return (
    <div>
      <h1 className="font-display text-3xl font-normal text-brand-charcoal mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Products" value={products.value} />
        <StatCard label="Orders" value={orders.value} />
        <StatCard label="Unread Messages" value={unread.value} />
        <StatCard label="Subscribers" value={subscribers.value} />
      </div>

      {(!products.ok || !orders.ok || !unread.ok || !subscribers.ok) && (
        <p className="mt-6 font-sans text-xs text-gray-400">
          Some stats couldn't be loaded. Refresh to try again.
        </p>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | null }) {
  const loading = value === null

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">
        {label}
      </p>

      {loading ? (
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="font-display text-3xl text-brand-charcoal">{value}</p>
      )}
    </div>
  )
}