import { useState } from 'react'

export interface CartItem {
  id: string
  barcode: string
  sku_reference: string
  mrp: number
  image_url?: string
  quantity?: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(item: CartItem) {
    const existing = items.find(i => i.id === item.id)
    if (existing) {
      setItems(items.map(i =>
        i.id === item.id
          ? { ...i, quantity: (i.quantity || 1) + 1 }
          : i
      ))
    } else {
      setItems([...items, { ...item, quantity: 1 }])
    }
  }

  function removeItem(id: string) {
    setItems(items.filter(i => i.id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setItems(items.map(i =>
        i.id === id ? { ...i, quantity } : i
      ))
    }
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + (item.mrp * (item.quantity || 1)), 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, total }
}
