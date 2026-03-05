import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

async function getPost(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post Not Found' }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const htmlContent = DOMPurify.sanitize(marked(post.content || '') as string)

  return (
    <div className="pt-20 min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="relative">
        {post.cover_image_url ? (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-brand-charcoal/50" />
          </div>
        ) : (
          <div className="h-64 md:h-80 bg-gradient-to-br from-fuchsia-950 to-fuchsia-800" />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
            {post.tags.length > 0 && (
              <div className="flex gap-2 mb-4">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="font-sans text-xs tracking-widest uppercase text-fuchsia-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-3xl md:text-5xl font-400 text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 font-sans text-sm text-white/70">
              <span>{post.author}</span>
              <span>·</span>
              <span>
                {post.published_at
                  ? format(new Date(post.published_at), 'MMMM d, yyyy')
                  : ''}
              </span>
              <span>·</span>
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 md:p-12">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="btn-outline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}