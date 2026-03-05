import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-400 text-brand-charcoal mb-8">New Blog Post</h1>
      <BlogPostForm />
    </div>
  )
}
