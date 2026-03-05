export const runtime = 'nodejs'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // ✅ unwrap Promise

  const supabase = await createClient() // ✅ await server client

  const { data: product } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('id', id) // ✅ use unwrapped id
    .single()

  if (!product) notFound()

  return (
    <div>
      <h1 className="font-display text-3xl font-normal text-brand-charcoal mb-8">
        Edit Product
      </h1>
      <ProductForm product={product as any} />
    </div>
  )
}

