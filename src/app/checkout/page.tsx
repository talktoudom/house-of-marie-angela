'use client'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  street: z.string().min(3, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  country: z.string().default('Nigeria'),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, total, mounted } = useCart()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'Nigeria' }
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items,
          total,
          shipping_address: { street: data.street, city: data.city, state: data.state, country: data.country },
        }),
      })
      const json = await res.json()
      if (json.authorization_url) {
        window.location.href = json.authorization_url
      } else {
        toast.error(json.error || 'Payment initialization failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return <div className="pt-20 min-h-screen bg-brand-cream" />
  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-400 text-brand-charcoal mb-4">Your cart is empty</h1>
          <a href="/shop" className="btn-primary">Shop Now</a>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      <div className="bg-brand-fuchsia py-12 text-white text-center">
        <h1 className="font-display text-4xl font-400">Checkout</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6">
                <h2 className="font-display text-xl font-400 text-brand-charcoal mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input {...register('name')} className="input-field" placeholder="Ada Okonkwo" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Email</label>
                      <input {...register('email')} type="email" className="input-field" placeholder="ada@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input {...register('phone')} className="input-field" placeholder="+234 800 000 0000" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6">
                <h2 className="font-display text-xl font-400 text-brand-charcoal mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Street Address</label>
                    <input {...register('street')} className="input-field" placeholder="12 Adeola Hopewell Street" />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">City</label>
                      <input {...register('city')} className="input-field" placeholder="Lagos" />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="label">State</label>
                      <input {...register('state')} className="input-field" placeholder="Lagos State" />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input {...register('country')} className="input-field" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 sticky top-24">
                <h2 className="font-display text-xl font-400 text-brand-charcoal mb-6">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex justify-between">
                      <div>
                        <p className="font-sans text-xs text-brand-charcoal">{item.title}</p>
                        <p className="font-sans text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-sans text-xs font-500">{formatPrice((item.sale_price ?? item.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-sans text-sm font-500 text-brand-charcoal">Total</span>
                    <span className="font-sans text-lg font-500 text-brand-charcoal">{formatPrice(total)}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Pay with Paystack'
                  )}
                </button>
                <p className="font-sans text-xs text-gray-400 text-center mt-3">
                  🔒 Secured by Paystack
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
