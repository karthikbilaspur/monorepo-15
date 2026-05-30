import { create } from 'zustand'
import { CartStore, Product } from '../types/pos'

const TAX_RATE = Number(import.meta.env.VITE_TAX_RATE) || 0.08

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    const items = get().items
    const existing = items.find(i => i.productId === product.id)
    if (existing) {
      set({
        items: items.map(i =>
          i.productId === product.id? {...i, quantity: i.quantity + 1 } : i
        )
      })
    } else {
      set({ items: [...items, { productId: product.id, product, quantity: 1 }] })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter(i => i.productId!== productId) })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set({
      items: get().items.map(i =>
        i.productId === productId? {...i, quantity } : i
      )
    })
  },

  clearCart: () => set({ items: [] }),

  subtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },

  tax: () => {
    return get().items.reduce((sum, item) => {
      const rate = item.product.taxRate?? TAX_RATE
      return sum + item.product.price * item.quantity * rate
    }, 0)
  },

  total: () => {
    return get().subtotal() + get().tax()
  }
}))