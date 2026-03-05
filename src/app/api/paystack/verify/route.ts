import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyTransaction } from '@/lib/paystack'

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  if (!reference) return NextResponse.json({ error: 'Reference required' }, { status: 400 })

  try {
    const transaction = await verifyTransaction(reference)
    if (transaction.status !== 'success') {
      return NextResponse.json({ success: false, status: transaction.status })
    }

    const supabase = createServiceClient()
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        paystack_transaction_id: String(transaction.id),
      })
      .eq('paystack_reference', reference)

    return NextResponse.json({ success: true, reference })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
