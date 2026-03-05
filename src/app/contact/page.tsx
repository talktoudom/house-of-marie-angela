'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
})
type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { toast.success('Message sent! We\'ll be in touch soon.'); reset() }
      else toast.error('Failed to send message')
    } catch { toast.error('Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      <div className="bg-brand-fuchsia py-16 text-white text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-fuchsia-200 mb-3">Get In Touch</p>
        <h1 className="font-display text-4xl lg:text-5xl font-400">Contact Us</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-400 text-brand-charcoal mb-8">We'd love to hear from you</h2>
            <div className="space-y-6">
              {[
                { icon: '📍', label: 'Address', value: 'Victoria Island, Lagos, Nigeria' },
                { icon: '📞', label: 'Phone', value: '+234 800 HMA STYLE' },
                { icon: '✉️', label: 'Email', value: 'hello@houseofmarieangela.com' },
                { icon: '📸', label: 'Instagram', value: '@houseofmarieangela' },
                { icon: '💬', label: 'WhatsApp', value: '+234 800 HMA STYLE' },
              ].map(item => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-sans text-xs tracking-widest uppercase text-gray-400 mb-1">{item.label}</p>
                    <p className="font-body text-base text-brand-charcoal">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 space-y-6">
            <h2 className="font-display text-2xl font-400 text-brand-charcoal">Send a Message</h2>
            <div>
              <label className="label">Your Name</label>
              <input {...register('name')} className="input-field" placeholder="Ada Okonkwo" />
              {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input {...register('email')} type="email" className="input-field" placeholder="ada@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
              </div>
              <div>
                <label className="label">Phone (Optional)</label>
                <input {...register('phone')} className="input-field" placeholder="+234 ..." />
              </div>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea {...register('message')} rows={5} className="input-field resize-none" placeholder="Tell us how we can help..." />
              {errors.message && <p className="text-red-500 text-xs mt-1">Message must be at least 10 characters</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-70">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
