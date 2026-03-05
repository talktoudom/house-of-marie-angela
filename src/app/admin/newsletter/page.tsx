export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminNewsletterPage() {
  const supabase = await createClient()

  const { data: subscribers, count } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-normal text-brand-charcoal">
            Newsletter Subscribers
          </h1>
          <p className="font-sans text-sm text-gray-400 mt-1">
            {count || 0} active subscribers
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['Email', 'Name', 'Date Subscribed', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-sans text-xs text-gray-400 uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {(subscribers || []).map((sub: any) => (
              <tr
                key={sub.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {sub.email}
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {sub.name || '—'}
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {sub.created_at
                    ? new Date(sub.created_at).toLocaleDateString()
                    : '—'}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`font-sans text-xs px-2 py-1 rounded-full ${
                      sub.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {sub.active ? 'active' : 'inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!subscribers || subscribers.length === 0) && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-gray-400">
              No subscribers yet.
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom-Left Dashboard Breadcrumb */}
      <div className="fixed left-6 bottom-6 z-50">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-2
                     font-sans text-xs text-gray-600 shadow-sm backdrop-blur
                     hover:border-brand-fuchsia hover:text-brand-fuchsia transition-colors"
        >
          <span aria-hidden>←</span>
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
