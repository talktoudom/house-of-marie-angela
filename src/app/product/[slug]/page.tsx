import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { ProductDetail } from '@/components/shop/ProductDetail'

type PageProps = {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient() // ✅ FIX: must await

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images (
        id,
        public_id,
        secure_url,
        is_primary,
        sort_order
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    // If nothing found, Supabase often returns an error here; treat as notFound
    return null
  }

  if (!data) return null

  // ✅ Normalize/sort images so primary comes first
  const images = Array.isArray((data as any).images) ? (data as any).images : []
  images.sort((a: any, b: any) => {
    const ap = a?.is_primary ? 1 : 0
    const bp = b?.is_primary ? 1 : 0
    if (ap !== bp) return bp - ap // primary first
    const ao = typeof a?.sort_order === 'number' ? a.sort_order : 0
    const bo = typeof b?.sort_order === 'number' ? b.sort_order : 0
    return ao - bo
  })

  return { ...(data as any), images }
}

async function getRelated(category: string, excludeId: string) {
  const supabase = await createClient() // ✅ FIX: must await

  const { data } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images (
        id,
        public_id,
        secure_url,
        is_primary,
        sort_order
      )
    `
    )
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', excludeId)
    .order('updated_at', { ascending: false })
    .limit(4)

  const related = (data as any[]) || []
  related.forEach((p) => {
    const imgs = Array.isArray(p.images) ? p.images : []
    imgs.sort((a: any, b: any) => {
      const ap = a?.is_primary ? 1 : 0
      const bp = b?.is_primary ? 1 : 0
      if (ap !== bp) return bp - ap
      const ao = typeof a?.sort_order === 'number' ? a.sort_order : 0
      const bo = typeof b?.sort_order === 'number' ? b.sort_order : 0
      return ao - bo
    })
    p.images = imgs
  })

  return related
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params // ✅ unwrap params Promise
  const product = await getProduct(slug)

  if (!product) return { title: 'Product Not Found' }

  const imageUrl =
    product?.images?.[0]?.secure_url ||
    undefined

  return {
    title: product.title,
    description: product.short_description,
    openGraph: imageUrl ? { images: [imageUrl] } : undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params // ✅ unwrap params Promise
  const product = await getProduct(slug)

  if (!product) notFound()

  const related = await getRelated(product.category, product.id)

  // ProductDetail should use product.images[0].secure_url (NOT url)
  return <ProductDetail product={product as any} related={related as any} />
}