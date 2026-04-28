import type { Product } from '@/types/product.types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product: Product) => {
          const { items } = get()
          const existing = items.find((i) => i.product.id === product.id)
          if (existing) {
            set({
              items: items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            })
          } else {
            set({ items: [...items, { product, quantity: 1 }] })
          }
        },

        removeItem: (productId: number) =>
          set((state) => ({
            items: state.items.filter((i) => i.product.id !== productId),
          })),

        updateQuantity: (productId: number, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(productId)
            return
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          }))
        },

        clearCart: () => set({ items: [] }),

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

        totalPrice: () =>
          get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      }),
      { name: 'react-store-cart' }
    ),
    { name: 'CartStore' }
  )
)
