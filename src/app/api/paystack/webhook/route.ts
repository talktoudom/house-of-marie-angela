import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyWebhookSignature } from '@/lib/paystack'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-paystack-signature') || ''

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true })
  }

  const reference = event.data.reference
  const transactionId = String(event.data.id)

  const supabase = createServiceClient()

  // Check if already processed (idempotency)
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('paystack_reference', reference)
    .single()

  if (order && order.status !== 'pending') {
    return NextResponse.json({ received: true })
  }

  await supabase
    .from('orders')
    .update({ status: 'paid', paystack_transaction_id: transactionId })
    .eq('paystack_reference', reference)

  return NextResponse.json({ received: true })
}
