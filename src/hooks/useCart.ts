'use client'
import { useState, useEffect, useCallback } from 'react'
import { CartItem } from '@/types'

const CART_KEY = 'hma_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(CART_KEY)
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch {}
    }
  }, [])

  const save = (newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem(CART_KEY, JSON.stringify(newItems))
  }

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const key = `${item.product_id}-${item.size}-${item.color}`
      const existing = prev.find(i => `${i.product_id}-${i.size}-${i.color}` === key)
      let next: CartItem[]
      if (existing) {
        next = prev.map(i => `${i.product_id}-${i.size}-${i.color}` === key
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
        )
      } else {
        next = [...prev, item]
      }
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems(prev => {
      const next = prev.filter(i => !(i.product_id === productId && i.size === size && i.color === color))
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const updateQuantity = useCallback((productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    setItems(prev => {
      const next = prev.map(i =>
        i.product_id === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      ).filter(i => i.quantity > 0)
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_KEY)
  }, [])

  const total = items.reduce((sum, item) => {
    const price = item.sale_price ?? item.price
    return sum + price * item.quantity
  }, 0)

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, total, count, mounted }
}
