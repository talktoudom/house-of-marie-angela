'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createSlug } from '@/lib/utils'
import toast from 'react-hot-toast'
import { marked } from 'marked'
import { Product } from '@/types'

const schema = z.object({
  title: z.string().min(2),
  category: z.enum(['women', 'men', 'children', 'jewelry']),
  subcategory: z.string().optional(),
  price: z.number().positive(),
  sale_price: z.number().optional().nullable(),
  sizes: z.string(), // comma-separated
  colors: z.string(), // comma-separated
  stock_quantity: z.number().int().min(0),
  sku: z.string().min(1),
  short_description: z.string().min(10),
  full_description: z.string().min(10),
  admin_review_notes: z.string().optional(),
  is_featured: z.boolean(),
  status: z.enum(['draft', 'published']),
})

type FormData = z.infer<typeof schema>

type ImageItem = {
  public_id: string
  secure_url: string
  is_primary: boolean
  sort_order: number
  existing?: boolean
}

interface Props {
  product?: Product
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Load existing images when editing
  const initialImages = useMemo<ImageItem[]>(() => {
    const imgs = ((product as any)?.images || []) as any[]
    if (!imgs.length) return []

    const sorted = [...imgs].sort((a, b) => {
      const ao = typeof a.sort_order === 'number' ? a.sort_order : 0
      const bo = typeof b.sort_order === 'number' ? b.sort_order : 0
      return ao - bo
    })

    const mapped: ImageItem[] = sorted.map((img: any, idx: number) => ({
      public_id: String(img.public_id ?? `existing-${idx}`),
      secure_url: String(img.secure_url ?? ''),
      is_primary: Boolean(img.is_primary) || false,
      sort_order: typeof img.sort_order === 'number' ? img.sort_order : idx,
      existing: true,
    }))

    // Ensure exactly one primary in UI
    if (mapped.length > 0 && !mapped.some(i => i.is_primary)) mapped[0].is_primary = true
    if (mapped.filter(i => i.is_primary).length > 1) {
      let seen = false
      for (const m of mapped) {
        if (m.is_primary) {
          if (!seen) seen = true
          else m.is_primary = false
        }
      }
    }

    // Normalize sort order
    return mapped.map((m, idx) => ({ ...m, sort_order: idx }))
  }, [product])

  const [images, setImages] = useState<ImageItem[]>(initialImages)

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          ...(product as any),
          sizes: (product as any).sizes?.join?.(', ') || '',
          colors: (product as any).colors?.join?.(', ') || '',
          sale_price: (product as any).sale_price ?? null,
        }
      : {
          is_featured: false,
          status: 'draft',
          stock_quantity: 0,
          sizes: '',
          colors: '',
        },
  })

  const fullDescription = watch('full_description')

  // Replace images in DB to match UI state
  const replaceProductImages = async (supabase: any, productId: string) => {
    const { error: delErr } = await supabase.from('product_images').delete().eq('product_id', productId)
    if (delErr) throw new Error(delErr.message || 'Failed deleting old images')

    const cleaned = images
      .filter(i => typeof i.secure_url === 'string' && i.secure_url.trim().length > 0)
      .map((img, idx) => ({ ...img, sort_order: idx }))

    if (!cleaned.length) return

    // Ensure exactly one primary
    if (!cleaned.some(i => i.is_primary)) cleaned[0].is_primary = true
    if (cleaned.filter(i => i.is_primary).length > 1) {
      let seen = false
      for (const i of cleaned) {
        if (i.is_primary) {
          if (!seen) seen = true
          else i.is_primary = false
        }
      }
    }

    const rows = cleaned.map(img => ({
      product_id: productId,
      public_id: img.public_id,
      secure_url: img.secure_url,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    }))

    const { error: insErr } = await supabase.from('product_images').insert(rows)
    if (insErr) throw new Error(insErr.message || 'Failed inserting product images')
  }

  // ✅ UNSIGNED CLOUDINARY UPLOAD (preset-based)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (!cloudName || !uploadPreset) {
        throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || uploadData?.error) {
        throw new Error(uploadData?.error?.message || 'Cloudinary upload failed')
      }

      if (!uploadData?.secure_url) {
        throw new Error('Cloudinary did not return secure_url')
      }

      setImages(prev => {
        const base = prev.map((img, idx) => ({ ...img, sort_order: idx }))
        const next: ImageItem[] = [
          ...base,
          {
            public_id: String(uploadData.public_id),
            secure_url: String(uploadData.secure_url),
            is_primary: base.length === 0,
            sort_order: base.length,
          },
        ]

        // Ensure exactly one primary
        if (!next.some(i => i.is_primary) && next.length > 0) next[0].is_primary = true
        if (next.filter(i => i.is_primary).length > 1) {
          let seen = false
          for (const i of next) {
            if (i.is_primary) {
              if (!seen) seen = true
              else i.is_primary = false
            }
          }
        }

        return next.map((img, idx) => ({ ...img, sort_order: idx }))
      })

      toast.success('Image uploaded')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Image upload failed')
    } finally {
      setUploadingImage(false)
      e.target.value = '' // allow re-upload same file
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const slug = (product as any)?.slug || createSlug(data.title)

      const payload: any = {
        ...data,
        slug,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
        sale_price: data.sale_price || null,
      }

      if (product) {
        const productId = (product as any).id

        const { error } = await supabase
          .from('products')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', productId)

        if (error) throw error

        await replaceProductImages(supabase, productId)
        toast.success('Product updated!')
      } else {
        // ✅ FIX: select only `id` so TS knows what comes back
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(payload)
          .select('id')
          .single()

        if (error) throw error
        if (!newProduct?.id) throw new Error('Failed to create product (missing id)')

        await replaceProductImages(supabase, newProduct.id)
        toast.success('Product created!')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Basic Info</h2>

            <div>
              <label className="label">Title *</label>
              <input {...register('title')} className="input-field" placeholder="Elegant Ankara Blazer" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category *</label>
                <select {...register('category')} className="input-field">
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="children">Children</option>
                  <option value="jewelry">Jewelry</option>
                </select>
              </div>
              <div>
                <label className="label">Subcategory</label>
                <input {...register('subcategory')} className="input-field" placeholder="Blazers, Dresses..." />
              </div>
            </div>

            <div>
              <label className="label">SKU *</label>
              <input {...register('sku')} className="input-field" placeholder="HMA-W-001" />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
            </div>

            <div>
              <label className="label">Short Description *</label>
              <textarea
                {...register('short_description')}
                rows={2}
                className="input-field resize-none"
                placeholder="Brief product description"
              />
              {errors.short_description && (
                <p className="text-red-500 text-xs mt-1">{errors.short_description.message}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Pricing & Stock</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (NGN) *</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="25000"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="label">Sale Price (optional)</label>
                <input
                  {...register('sale_price', { valueAsNumber: true, setValueAs: v => (v === '' ? null : Number(v)) })}
                  type="number"
                  className="input-field"
                  placeholder="20000"
                />
              </div>
            </div>

            <div>
              <label className="label">Stock Quantity *</label>
              <input
                {...register('stock_quantity', { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="10"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Variants</h2>

            <div>
              <label className="label">Sizes (comma-separated)</label>
              <input {...register('sizes')} className="input-field" placeholder="XS, S, M, L, XL" />
            </div>
            <div>
              <label className="label">Colors (comma-separated)</label>
              <input {...register('colors')} className="input-field" placeholder="Black, White, Fuchsia" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-400 text-brand-charcoal">Full Description (Markdown)</h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="font-sans text-xs text-brand-fuchsia hover:underline"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {showPreview ? (
              <div
                className="prose-content min-h-[200px] border border-gray-100 p-4"
                dangerouslySetInnerHTML={{ __html: marked(fullDescription || '') as string }}
              />
            ) : (
              <textarea
                {...register('full_description')}
                rows={10}
                className="input-field resize-y font-mono text-xs"
                placeholder="## Product Details&#10;&#10;Describe your product in detail..."
              />
            )}

            {errors.full_description && <p className="text-red-500 text-xs mt-1">{errors.full_description.message}</p>}
          </div>

          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Images</h2>

            <label
              className={`block border-2 border-dashed border-gray-200 rounded p-6 text-center cursor-pointer hover:border-brand-fuchsia transition-colors ${
                uploadingImage ? 'opacity-50' : ''
              }`}
            >
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
              <p className="font-sans text-sm text-gray-400">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</p>
              <p className="font-sans text-xs text-gray-300 mt-1">JPG, PNG, WEBP up to 10MB</p>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={`${img.public_id}-${i}`} className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.secure_url} alt="" className="w-full h-full object-cover rounded" />
                    {img.is_primary && (
                      <span className="absolute top-1 left-1 bg-brand-fuchsia text-white text-xs px-1 py-0.5">Primary</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Settings</h2>

            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input {...register('is_featured')} type="checkbox" id="is_featured" className="w-4 h-4 accent-brand-fuchsia" />
              <label htmlFor="is_featured" className="font-sans text-sm text-brand-charcoal">
                Feature this product
              </label>
            </div>

            <div>
              <label className="label">Admin Notes (Internal)</label>
              <textarea
                {...register('admin_review_notes')}
                rows={3}
                className="input-field resize-none"
                placeholder="Internal notes, not visible to customers"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn-primary py-3 px-12 disabled:opacity-70">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline py-3 px-8">
          Cancel
        </button>
      </div>
    </form>
  )
}