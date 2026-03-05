'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const pathname = usePathname()
  const { count, mounted } = useCart()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isHome = pathname === '/'
  const navBg = scrolled || !isHome ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-transparent'
  const textColor = scrolled || !isHome ? 'text-brand-charcoal' : 'text-white'
  const logoColor = scrolled || !isHome ? 'text-brand-fuchsia' : 'text-white'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className={`font-display text-xl lg:text-2xl font-600 ${logoColor} transition-colors`}>
              <span>House of</span>
              <br className="hidden sm:block" />
              <span className="italic">Marie-Angela</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative group" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <Link href="/shop" className={`font-sans text-xs tracking-widest uppercase font-500 ${textColor} hover:text-brand-fuchsia transition-colors`}>
                Shop
              </Link>
              {shopOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg py-2 z-50">
                  {[['Women', '/shop/women'], ['Men', '/shop/men'], ['Children', '/shop/children'], ['Jewelry & Accessories', '/shop/jewelry']].map(([label, href]) => (
                    <Link key={href} href={href} className="block px-4 py-2 font-sans text-xs tracking-widest uppercase text-brand-charcoal hover:text-brand-fuchsia hover:bg-fuchsia-50 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {[['Blog', '/blog'], ['Academy', '/academy'], ['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={href} href={href} className={`font-sans text-xs tracking-widest uppercase font-500 ${textColor} hover:text-brand-fuchsia transition-colors`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className={`relative ${textColor} hover:text-brand-fuchsia transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && count > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-fuchsia text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button className={`lg:hidden ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            {[
              ['Shop All', '/shop'],
              ['Women', '/shop/women'],
              ['Men', '/shop/men'],
              ['Children', '/shop/children'],
              ['Jewelry', '/shop/jewelry'],
              ['Blog', '/blog'],
              ['Academy', '/academy'],
              ['About', '/about'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="block py-3 px-4 font-sans text-xs tracking-widest uppercase text-brand-charcoal hover:text-brand-fuchsia hover:bg-fuchsia-50 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
