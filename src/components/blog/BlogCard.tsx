import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/types'
import { format } from 'date-fns'

interface BlogCardProps {
  post: BlogPost
  priority?: boolean
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="luxury-card overflow-hidden">
        {/* Cover */}
        <div className="relative aspect-video overflow-hidden bg-fuchsia-50">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-brand-fuchsia text-2xl italic">HMA</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs font-sans tracking-widest uppercase text-brand-fuchsia">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="font-display text-lg font-400 text-brand-charcoal mb-2 group-hover:text-brand-fuchsia transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="font-sans text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-xs text-gray-400">{post.author}</p>
              <p className="font-sans text-xs text-gray-400">
                {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}
              </p>
            </div>
            <span className="font-sans text-xs text-gray-400">{post.reading_time} min read</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
