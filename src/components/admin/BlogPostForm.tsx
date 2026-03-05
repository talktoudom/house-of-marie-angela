'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createSlug } from '@/lib/utils'
import toast from 'react-hot-toast'
import { marked } from 'marked'
import { BlogPost } from '@/types'

const schema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  excerpt: z.string().min(10),
  author: z.string().min(2),
  tags: z.string(),
  status: z.enum(['draft', 'published']),
})
type FormData = z.infer<typeof schema>

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [coverImage, setCoverImage] = useState<{ public_id: string; secure_url: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: post ? {
      ...post,
      tags: post.tags.join(', '),
    } : { status: 'draft', author: 'Marie-Angela' },
  })

  const content = watch('content')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const sigRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'hma-blog' }),
      })
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', apiKey)
      formData.append('folder', folder)
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      setCoverImage({ public_id: uploadData.public_id, secure_url: uploadData.secure_url })
      toast.success('Image uploaded')
    } catch { toast.error('Upload failed') } finally { setUploadingImage(false) }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const slug = post?.slug || createSlug(data.title)
      const readingTime = Math.ceil(data.content.split(/\s+/).length / 200)
      const payload = {
        ...data,
        slug,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        reading_time: readingTime,
        cover_image_url: coverImage?.secure_url || post?.cover_image_url || null,
        cover_image_public_id: coverImage?.public_id || post?.cover_image_public_id || null,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      }

      if (post) {
        const { error } = await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', post.id)
        if (error) throw error
        toast.success('Post updated!')
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload)
        if (error) throw error
        toast.success('Post created!')
      }
      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded space-y-4">
            <div>
              <label className="label">Title *</label>
              <input {...register('title')} className="input-field text-lg" placeholder="Your Fashion Story Title" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label">Excerpt</label>
              <textarea {...register('excerpt')} rows={2} className="input-field resize-none" placeholder="Brief summary for previews" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Content (Markdown) *</label>
                <button type="button" onClick={() => setShowPreview(!showPreview)} className="font-sans text-xs text-brand-fuchsia hover:underline">
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              {showPreview ? (
                <div className="prose-content border border-gray-100 p-4 min-h-64" dangerouslySetInnerHTML={{ __html: marked(content || '') as string }} />
              ) : (
                <textarea {...register('content')} rows={20} className="input-field resize-y font-mono text-xs" placeholder="Write your blog post in Markdown..." />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Settings</h2>
            <div>
              <label className="label">Author</label>
              <input {...register('author')} className="input-field" />
            </div>
            <div>
              <label className="label">Tags (comma-separated)</label>
              <input {...register('tags')} className="input-field" placeholder="Fashion, Style, Tips" />
            </div>
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="font-display text-lg font-400 text-brand-charcoal">Cover Image</h2>
            <label className={`block border-2 border-dashed border-gray-200 rounded p-4 text-center cursor-pointer hover:border-brand-fuchsia transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
              <p className="font-sans text-sm text-gray-400">{uploadingImage ? 'Uploading...' : 'Click to upload'}</p>
            </label>
            {(coverImage?.secure_url || post?.cover_image_url) && (
              <img src={coverImage?.secure_url || post?.cover_image_url} alt="Cover" className="w-full rounded" />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn-primary py-3 px-12 disabled:opacity-70">
          {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline py-3 px-8">Cancel</button>
      </div>
    </form>
  )
}
