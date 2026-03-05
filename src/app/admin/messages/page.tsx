export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminMessagesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="relative">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-normal text-brand-charcoal">
          Messages
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white rounded overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['From', 'Subject', 'Status', 'Date', 'Actions'].map((h) => (
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
            {(messages || []).map((m: any) => (
              <tr
                key={m.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-brand-charcoal">
                    {m.name || '—'}
                  </p>
                  <p className="font-sans text-xs text-gray-400">{m.email || '—'}</p>
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {m.subject || '—'}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`font-sans text-xs px-2 py-1 rounded-full ${
                      m.read
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-fuchsia-100 text-fuchsia-800'
                    }`}
                  >
                    {m.read ? 'read' : 'unread'}
                  </span>
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={`/admin/messages/${m.id}`}
                    className="font-sans text-xs text-brand-fuchsia hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!messages || messages.length === 0) && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-gray-400">No messages yet.</p>
          </div>
        )}
      </div>

      {/* Floating bottom-left breadcrumb */}
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
