export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getCloudinarySignature } from '@/lib/cloudinary'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Verify admin (requires a logged-in session cookie)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const folder = body?.folder || 'hma-products'

  const { signature, timestamp } = getCloudinarySignature({ folder })

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  })
}
