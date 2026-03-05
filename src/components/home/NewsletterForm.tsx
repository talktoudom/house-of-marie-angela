'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast.success('Welcome to the HMA family!')
        setEmail('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Something went wrong')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 px-4 py-3 bg-white/10 border border-white/30 text-white placeholder-white/50 font-sans text-sm focus:outline-none focus:border-white transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-brand-fuchsia px-8 py-3 font-sans text-xs tracking-widest uppercase font-600 hover:bg-fuchsia-50 transition-colors disabled:opacity-70"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  )
}
