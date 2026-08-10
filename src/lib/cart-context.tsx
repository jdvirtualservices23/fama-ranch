'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type CartItem = {
  /** Identifica una línea única del carrito: mismo producto con distinta selección de sabores no se combinan. */
  cartItemId: string
  productId: string
  name: string
  priceUsd: number
  quantity: number
  /** Ej. "2x Pollo, 1x Queso" para combos que exigen elegir sabores. */
  selectionNote?: string
}

type NewCartItem = {
  productId: string
  name: string
  priceUsd: number
  selectionNote?: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: NewCartItem) => void
  removeItem: (cartItemId: string) => void
  setQuantity: (cartItemId: string, quantity: number) => void
  clear: () => void
  totalUsd: number
  totalItems: number
  hydrated: boolean
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'fama-ranch-cart'

function makeCartItemId(productId: string, selectionNote?: string) {
  return selectionNote ? `${productId}::${selectionNote}` : productId
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore malformed storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((item: NewCartItem) => {
    const cartItemId = makeCartItemId(item.productId, item.selectionNote)
    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId)
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, cartItemId, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId))
  }, [])

  const setQuantity = useCallback((cartItemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.cartItemId !== cartItemId)
      return prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalUsd = items.reduce((sum, i) => sum + i.priceUsd * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, totalUsd, totalItems, hydrated }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
