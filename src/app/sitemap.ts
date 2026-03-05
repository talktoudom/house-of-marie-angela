import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofmarieangela.com'
  const supabase = createClient()

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'published')

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')

  const staticRoutes = [
    '/', '/shop', '/shop/women', '/shop/men', '/shop/children', '/shop/jewelry',
    '/blog', '/about', '/contact', '/academy', '/privacy', '/terms', '/returns', '/shipping',
  ].map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  const productRoutes = (products || []).map(p => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const postRoutes = (posts || []).map(p => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...productRoutes, ...postRoutes]
}
