import slugify from 'slugify'

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true })
}

export function formatPrice(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function toKobo(amount: number): number {
  return Math.round(amount * 100)
}

export function fromKobo(amount: number): number {
  return amount / 100
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '…'
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
