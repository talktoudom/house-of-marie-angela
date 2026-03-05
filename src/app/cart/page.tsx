'use client'
import { useCart } from '@/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count, mounted } = useCart()

  if (!mounted) return <div className="pt-20 min-h-screen bg-brand-cream" />

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">🛍️</div>
          <h1 className="font-display text-3xl font-400 text-brand-charcoal mb-4">Your cart is empty</h1>
          <p className="font-sans text-sm text-gray-400 mb-8">Discover our luxury collections and find something you love.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      <div className="bg-brand-fuchsia py-12 text-white text-center">
        <h1 className="font-display text-4xl font-400">Shopping Cart</h1>
        <p className="font-sans text-sm text-fuchsia-200 mt-2">{count} item{count !== 1 ? 's' : ''}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.product_id}-${item.size}-${item.color}`} className="bg-white p-4 flex gap-4">
                <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-gray-50">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="font-display text-base font-400 text-brand-charcoal hover:text-brand-fuchsia transition-colors line-clamp-1">
                    {item.title}
                  </Link>
                  <div className="flex gap-3 mt-1">
                    {item.size && <p className="font-sans text-xs text-gray-400">Size: {item.size}</p>}
                    {item.color && <p className="font-sans text-xs text-gray-400">Color: {item.color}</p>}
                  </div>
                  <p className="font-sans text-sm font-500 text-brand-charcoal mt-1">
                    {formatPrice(item.sale_price ?? item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50 font-sans">−</button>
                      <span className="px-4 py-1 font-sans text-sm border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50 font-sans">+</button>
                    </div>
                    <button onClick={() => removeItem(item.product_id, item.size, item.color)} className="font-sans text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 h-fit">
            <h2 className="font-display text-xl font-400 text-brand-charcoal mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
              {items.map(item => (
                <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex justify-between">
                  <span className="font-sans text-xs text-gray-500 max-w-[180px] truncate">{item.title} ×{item.quantity}</span>
                  <span className="font-sans text-xs text-brand-charcoal">{formatPrice((item.sale_price ?? item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-sans text-sm font-500 text-brand-charcoal">Total</span>
              <span className="font-sans text-lg font-500 text-brand-charcoal">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="btn-outline w-full text-center block mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
