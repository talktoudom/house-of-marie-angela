import { createClient } from '@/lib/supabase/server'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogPost } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fashion Blog',
  description: 'Fashion stories, tips, and insights from House of Marie-Angela Exquisite.',
}

const PAGE_SIZE = 9

type BlogSearchParams = Record<string, string | string[] | undefined>

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>
}) {
  const sp = await searchParams
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const page = parseInt(pageParam || '1', 10) - 1

  const supabase = await createClient()

  const { data, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  const posts = (data as BlogPost[]) || []
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
  const currentPage = page + 1

  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      <div className="bg-brand-fuchsia py-16 text-white text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-fuchsia-200 mb-3">Journal</p>
        <h1 className="font-display text-4xl lg:text-5xl font-normal">Fashion Stories</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <p className="text-center font-display text-2xl text-gray-400 italic py-20">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} priority={i < 3} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`?page=${p}`}
                className={`w-10 h-10 flex items-center justify-center font-sans text-sm transition-colors ${
                  p === currentPage
                    ? 'bg-brand-fuchsia text-white'
                    : 'bg-white text-brand-charcoal border border-gray-200 hover:border-brand-fuchsia'
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}