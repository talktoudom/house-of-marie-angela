'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart()
  const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0]
  const displayPrice = product.sale_price ?? product.price
  const isOnSale = !!product.sale_price && product.sale_price < product.price

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      sale_price: product.sale_price ?? undefined,
      quantity: 1,
      image_url: primaryImage?.secure_url || '',
      slug: product.slug,
    })
    toast.success(`${product.title} added to cart`)
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="luxury-card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.secure_url}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-fuchsia-50">
              <span className="font-display text-brand-fuchsia text-lg italic">HMA</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isOnSale && (
              <span className="bg-brand-fuchsia text-white text-xs font-sans font-500 px-2 py-0.5 tracking-wide">SALE</span>
            )}
            {product.is_featured && (
              <span className="bg-brand-charcoal text-white text-xs font-sans font-500 px-2 py-0.5 tracking-wide">FEATURED</span>
            )}
            {product.stock_quantity === 0 && (
              <span className="bg-gray-400 text-white text-xs font-sans font-500 px-2 py-0.5 tracking-wide">SOLD OUT</span>
            )}
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={product.stock_quantity === 0}
              className="w-full bg-brand-fuchsia text-white font-sans text-xs tracking-widest uppercase py-3 hover:bg-brand-fuchsia-deep transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stock_quantity === 0 ? 'Sold Out' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-sans text-xs tracking-widest uppercase text-gray-400 mb-1">{product.category}</p>
          <h3 className="font-display text-base font-400 text-brand-charcoal mb-2 line-clamp-1 group-hover:text-brand-fuchsia transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-500 text-brand-charcoal">
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && (
              <span className="font-sans text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
