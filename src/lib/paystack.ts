const PAYSTACK_BASE = 'https://api.paystack.co'

export async function initializeTransaction(data: {
  email: string
  amount: number // in kobo
  reference: string
  callback_url: string
  metadata?: Record<string, unknown>
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message || 'Paystack initialization failed')
  return json.data as { authorization_url: string; access_code: string; reference: string }
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message || 'Verification failed')
  return json.data as {
    status: string
    amount: number
    reference: string
    id: number
    customer: { email: string }
    metadata: Record<string, unknown>
  }
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const crypto = require('crypto')
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!).update(body).digest('hex')
  return hash === signature
}

export function generateReference(): string {
  return `HMA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}
