export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-normal text-brand-charcoal">
          Orders
        </h1>
      </div>

      <div className="bg-white rounded overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['Order', 'Customer', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
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
            {(orders || []).map((order: any) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-brand-charcoal">
                    {order.order_number || order.id}
                  </p>
                  <p className="font-sans text-xs text-gray-400">
                    {order.payment_reference || '—'}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <p className="font-sans text-sm text-brand-charcoal">
                    {order.customer_name || '—'}
                  </p>
                  <p className="font-sans text-xs text-gray-400">
                    {order.customer_email || '—'}
                  </p>
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {typeof order.total_amount === 'number'
                    ? formatPrice(order.total_amount)
                    : '—'}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`font-sans text-xs px-2 py-1 rounded-full ${
                      order.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {order.status || '—'}
                  </span>
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : '—'}
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-sans text-xs text-brand-fuchsia hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!orders || orders.length === 0) && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-gray-400">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
