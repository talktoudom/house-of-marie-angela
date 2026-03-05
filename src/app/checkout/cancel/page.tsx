import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="pt-20 min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-display text-3xl font-400 text-brand-charcoal mb-4">Payment Cancelled</h1>
        <p className="font-sans text-sm text-gray-500 mb-8">Your order was not completed. Your cart items are still saved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart" className="btn-primary">Return to Cart</Link>
          <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
