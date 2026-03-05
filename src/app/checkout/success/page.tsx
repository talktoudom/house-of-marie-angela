'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

function SuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('trxref')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const { clearCart } = useCart()

  useEffect(() => {
    if (!reference) { setStatus('error'); return }
    fetch(`/api/paystack/verify?reference=${reference}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          clearCart()
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [reference])

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-brand-fuchsia border-t-transparent rounded-full mx-auto mb-6" />
        <p className="font-sans text-sm text-gray-500">Verifying your payment...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-display text-3xl font-400 text-brand-charcoal mb-4">Payment Issue</h1>
        <p className="font-sans text-sm text-gray-500 mb-8">We couldn't verify your payment. Please contact us if you were charged.</p>
        <Link href="/contact" className="btn-primary">Contact Us</Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-display text-4xl font-400 text-brand-charcoal mb-4">Order Confirmed!</h1>
      <p className="font-sans text-base text-gray-500 mb-2">Thank you for shopping with House of Marie-Angela Exquisite.</p>
      <p className="font-sans text-xs text-gray-400 mb-8">Reference: {reference}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        <Link href="/" className="btn-outline">Back to Home</Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="pt-20 min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full py-16">
        <Suspense fallback={<div className="text-center font-sans text-sm text-gray-400">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
