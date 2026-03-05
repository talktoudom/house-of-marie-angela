import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json())
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, active: true }, { onConflict: 'email', ignoreDuplicates: false })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to subscribe' }, { status: 500 })
  }
}
