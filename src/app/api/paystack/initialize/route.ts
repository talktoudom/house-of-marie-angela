import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { initializeTransaction, generateReference } from '@/lib/paystack'
import { toKobo } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  items: z.array(z.object({
    product_id: z.string(),
    title: z.string(),
    price: z.number(),
    sale_price: z.number().optional(),
    quantity: z.number().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    image_url: z.string(),
    slug: z.string(),
  })),
  total: z.number().positive(),
  shipping_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    
    const supabase = createServiceClient()
    const reference = generateReference()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create pending order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_email: data.email,
        user_name: data.name,
        user_phone: data.phone,
        items: data.items as any,
        subtotal: data.total,
        total: data.total,
        status: 'pending',
        paystack_reference: reference,
        shipping_address: data.shipping_address as any,
      })
      .select()
      .single()

    if (error) throw error

    // Initialize Paystack
    const paystack = await initializeTransaction({
      email: data.email,
      amount: toKobo(data.total),
      reference,
      callback_url: `${siteUrl}/checkout/success`,
      metadata: { order_id: order.id, customer_name: data.name },
    })

    return NextResponse.json({ authorization_url: paystack.authorization_url, reference })
  } catch (err: any) {
    console.error('Paystack init error:', err)
    return NextResponse.json({ error: err.message || 'Initialization failed' }, { status: 500 })
  }
}
