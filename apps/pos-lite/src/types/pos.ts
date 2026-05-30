export type Product = {
  id: string
  name: string
  price: number // in cents
  category: string
  image?: string
  sku?: string
  taxRate?: number // override default
}

export type CartItem = {
  productId: string
  product: Product
  quantity: number
  notes?: string
}

export type PaymentMethod = 'cash' | 'card' | 'other'

export type Order = {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  cashReceived?: number
  change?: number
  createdAt: string
  cashierId: string
}

export type CartStore = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: () => number
  tax: () => number
  total: () => number
}