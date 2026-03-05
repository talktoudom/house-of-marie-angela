'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { ProductCard } from './ProductCard'
import toast from 'react-hot-toast'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

interface Props {
  product: Product
  related: Product[]
}

export function ProductDetail({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const images = product.images || []
  const currentImage = images[selectedImage]
  const isOnSale = !!product.sale_price && product.sale_price < product.price
  const displayPrice = product.sale_price ?? product.price

  const htmlContent = DOMPurify.sanitize(marked(product.full_description || '') as string)

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color')
      return
    }
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      sale_price: product.sale_price ?? undefined,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      image_url: images[0]?.secure_url || '',
      slug: product.slug,
    })
    toast.success(`${product.title} added to cart!`)
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 font-sans text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-fuchsia">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-fuchsia">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.category}`} className="hover:text-brand-fuchsia capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-brand-charcoal">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage.secure_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-fuchsia-50">
                  <span className="font-display text-brand-fuchsia text-4xl italic">HMA</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-brand-fuchsia' : 'border-transparent'}`}
                  >
                    <Image src={img.secure_url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-brand-fuchsia mb-2">{product.category}</p>
              <h1 className="font-display text-3xl lg:text-4xl font-400 text-brand-charcoal mb-3">{product.title}</h1>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">{product.short_description}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-sans text-2xl font-500 text-brand-charcoal">{formatPrice(displayPrice)}</span>
              {isOnSale && (
                <span className="font-sans text-base text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {isOnSale && <span className="bg-brand-fuchsia text-white text-xs font-sans px-2 py-0.5">SALE</span>}
            </div>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <p className="label">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[2.5rem] px-3 py-2 font-sans text-xs border transition-colors ${
                        selectedSize === size
                          ? 'bg-brand-fuchsia text-white border-brand-fuchsia'
                          : 'border-gray-200 hover:border-brand-fuchsia hover:text-brand-fuchsia'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="label">Color {selectedColor && <span className="normal-case font-400 text-brand-charcoal">— {selectedColor}</span>}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 font-sans text-xs border transition-colors ${
                        selectedColor === color
                          ? 'bg-brand-fuchsia text-white border-brand-fuchsia'
                          : 'border-gray-200 hover:border-brand-fuchsia hover:text-brand-fuchsia'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="label">Quantity</p>
              <div className="flex items-center border border-gray-200 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-50 transition-colors font-sans text-lg">−</button>
                <span className="px-6 py-2 font-sans text-sm border-x border-gray-200">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="px-4 py-2 hover:bg-gray-50 transition-colors font-sans text-lg">+</button>
              </div>
              <p className="font-sans text-xs text-gray-400 mt-2">{product.stock_quantity} in stock</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full btn-primary py-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* SKU */}
            <p className="font-sans text-xs text-gray-400">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 bg-white p-8">
          <h2 className="font-display text-2xl font-400 text-brand-charcoal mb-6">Product Details</h2>
          <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-400 text-brand-charcoal mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
