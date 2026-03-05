'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ShopFiltersProps {
  searchParams: Record<string, string | undefined>
  total: number
}

export function ShopFilters({ searchParams, total }: ShopFiltersProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.search || '')

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', search)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search & Sort row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field w-56 py-2"
          />
          <button type="submit" className="btn-primary py-2 px-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-4">
          <span className="font-sans text-xs text-gray-400">{total} items</span>
          <select
            value={searchParams.sort || ''}
            onChange={e => updateParam('sort', e.target.value)}
            className="input-field w-44 py-2 text-xs"
          >
            <option value="">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {[['All', ''], ['Women', 'women'], ['Men', 'men'], ['Children', 'children'], ['Jewelry', 'jewelry']].map(([label, value]) => (
          <button
            key={value}
            onClick={() => updateParam('category', value)}
            className={`px-4 py-1.5 font-sans text-xs tracking-widest uppercase transition-colors ${
              (searchParams.category || '') === value
                ? 'bg-brand-fuchsia text-white'
                : 'bg-white text-brand-charcoal border border-gray-200 hover:border-brand-fuchsia hover:text-brand-fuchsia'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
