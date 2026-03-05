import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .order('updated_at', { ascending: false })

  return (
    <div className="relative">
      {/* ✅ Floating button (always visible) */}
      <Link
        href="/admin/products/new"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center gap-2
                   rounded bg-brand-fuchsia px-4 py-3 text-white shadow-lg hover:opacity-90"
      >
        + New Product
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-normal text-brand-charcoal">Products</h1>

        {/* Keep this too (nice for desktop; floating covers layout overlap issues) */}
        <Link
          href="/admin/products/new"
          className="btn-primary inline-flex items-center justify-center gap-2 py-2 px-4 whitespace-nowrap rounded
                     bg-brand-fuchsia text-white hover:opacity-90"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
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
            {(products || []).map((product: any) => (
              <tr
                key={product.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-brand-charcoal">{product.title}</p>
                  <p className="font-sans text-xs text-gray-400">{product.sku}</p>
                </td>
                <td className="px-4 py-3 font-sans text-xs text-gray-500 capitalize">
                  {product.category}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {product.stock_quantity}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-sans text-xs px-2 py-1 rounded-full ${
                      product.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-sans text-xs text-brand-fuchsia hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-gray-400 mb-4">
              No products yet. Create your first one!
            </p>
            <Link
              href="/admin/products/new"
              className="btn-primary inline-flex items-center justify-center py-2 px-4 rounded
                         bg-brand-fuchsia text-white hover:opacity-90"
            >
              Create Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}