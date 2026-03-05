'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '👗' },
  { href: '/admin/blog', label: 'Blog Posts', icon: '📝' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: '📧' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    toast.success('Signed out')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-brand-charcoal text-white flex flex-col z-40">
      <div className="p-6 border-b border-white/10">
        <p className="font-display text-lg italic text-brand-fuchsia-light">Marie-Angela</p>
        <p className="font-sans text-xs text-gray-400 tracking-widest uppercase mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors font-sans text-sm ${
              pathname === link.href ? 'bg-brand-fuchsia text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="block px-4 py-2 font-sans text-xs text-gray-400 hover:text-white transition-colors mb-2">
          ← View Site
        </Link>
        <button onClick={handleSignOut} className="w-full px-4 py-2 font-sans text-xs text-red-400 hover:text-red-300 transition-colors text-left">
          Sign Out
        </button>
      </div>
    </aside>
  )
}
