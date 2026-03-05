import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

  const reference = event?.data?.reference
  const transactionId = String(event?.data?.id ?? '')

  if (!reference || !transactionId) {
    return NextResponse.json({ error: 'Missing reference or transaction id' }, { status: 400 })
  }

  const supabase = await createClient()

  // Check if already processed (idempotency)
  const { data: order, error: readError } = await supabase
    .from('orders')
    .select('status')
    .eq('paystack_reference', reference)
    .maybeSingle()

  if (readError) {
    console.error('Webhook read order error:', readError)
    return NextResponse.json({ error: 'Failed to read order' }, { status: 500 })
  }

  if (order && order.status !== 'pending') {
    return NextResponse.json({ received: true })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'paid', paystack_transaction_id: transactionId })
    .eq('paystack_reference', reference)

  if (updateError) {
    console.error('Webhook update order error:', updateError)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}