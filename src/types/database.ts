// src/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; role: string; created_at: string }
        Insert: { id: string; email: string; role?: string; created_at?: string }
        Update: { id?: string; email?: string; role?: string }
        Relationships: []
      }

      products: {
        Row: {
          id: string
          title: string
          slug: string
          category: string
          subcategory: string | null
          price: number
          sale_price: number | null
          sizes: string[]
          colors: string[]
          stock_quantity: number
          sku: string
          short_description: string
          full_description: string
          admin_review_notes: string | null
          is_featured: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['products']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }

      product_images: {
        Row: {
          id: string
          product_id: string
          public_id: string
          secure_url: string
          is_primary: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
        Relationships: []
      }

      // ✅ explicit Insert/Update + Relationships
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image_url: string | null
          cover_image_public_id: string | null
          author: string
          tags: string[]
          status: string
          reading_time: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image_url?: string | null
          cover_image_public_id?: string | null
          author: string
          tags: string[]
          status: string
          reading_time: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          cover_image_url?: string | null
          cover_image_public_id?: string | null
          author?: string
          tags?: string[]
          status?: string
          reading_time?: number
          published_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }

      orders: {
        Row: {
          id: string
          user_email: string
          user_name: string
          user_phone: string
          items: Json
          subtotal: number
          total: number
          status: string
          paystack_reference: string
          paystack_transaction_id: string | null
          shipping_address: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['orders']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }

      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size: string | null
          color: string | null
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: []
      }

      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          created_at: string
          read: boolean
        }
        Insert: Omit<
          Database['public']['Tables']['contact_messages']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>
        Relationships: []
      }

      newsletter_subscribers: {
        Row: { id: string; email: string; created_at: string; active: boolean }
        Insert: Omit<
          Database['public']['Tables']['newsletter_subscribers']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<
          Database['public']['Tables']['newsletter_subscribers']['Insert']
        >
        Relationships: []
      }
    }

    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}