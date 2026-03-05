export interface Product {
  id: string
  title: string
  slug: string
  category: 'women' | 'men' | 'children' | 'jewelry'
  subcategory?: string
  price: number
  sale_price?: number
  sizes: string[]
  colors: string[]
  stock_quantity: number
  sku: string
  short_description: string
  full_description: string
  admin_review_notes?: string
  is_featured: boolean
  status: 'draft' | 'published'
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  public_id: string
  secure_url: string
  is_primary: boolean
  sort_order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image_url?: string
  cover_image_public_id?: string
  author: string
  tags: string[]
  status: 'draft' | 'published'
  reading_time: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface Order {
  id: string
  user_email: string
  user_name: string
  user_phone: string
  items: CartItem[]
  subtotal: number
  total: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paystack_reference: string
  paystack_transaction_id?: string
  shipping_address: ShippingAddress
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  country: string
  postal_code?: string
}

export interface CartItem {
  product_id: string
  title: string
  price: number
  sale_price?: number
  quantity: number
  size?: string
  color?: string
  image_url: string
  slug: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  created_at: string
  read: boolean
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
  active: boolean
}
