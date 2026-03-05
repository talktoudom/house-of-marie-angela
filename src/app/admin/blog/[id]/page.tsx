import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  return (
    <div>
      <h1 className="font-display text-3xl font-400 text-brand-charcoal mb-8">Edit Post</h1>
      <BlogPostForm post={post as any} />
    </div>
  )
}
