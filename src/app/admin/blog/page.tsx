import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-normal text-brand-charcoal">
          Blog Posts
        </h1>
        <Link href="/admin/blog/new" className="btn-primary py-2">
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['Title', 'Status', 'Published', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-sans text-xs text-gray-400 uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(posts || []).map((post: any) => (
              <tr
                key={post.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-brand-charcoal">
                    {post.title}
                  </p>
                  <p className="font-sans text-xs text-gray-400">{post.slug}</p>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`font-sans text-xs px-2 py-1 rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>

                <td className="px-4 py-3 font-sans text-sm text-brand-charcoal">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : '—'}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-sans text-xs text-brand-fuchsia hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!posts || posts.length === 0) && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-gray-400 mb-4">
              No blog posts yet. Create your first one!
            </p>
            <Link href="/admin/blog/new" className="btn-primary">
              Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
