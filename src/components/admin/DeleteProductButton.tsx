'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Product deleted')
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="font-sans text-xs text-red-400 hover:text-red-600 hover:underline transition-colors">
      Delete
    </button>
  )
}
