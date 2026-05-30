import { useState } from 'react'
import { useCart } from './store/cart'
import { ProductGrid } from './components/ProductGrid'
import { CartPanel } from './components/CartPanel'
import { CheckoutModal } from './components/CheckoutModal'
import { Product, Order, PaymentMethod } from './types/pos'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Espresso', price: 350, category: 'Coffee', image: '☕' },
  { id: 'p2', name: 'Latte', price: 450, category: 'Coffee', image: '☕' },
  { id: 'p3', name: 'Cappuccino', price: 425, category: 'Coffee', image: '☕' },
  { id: 'p4', name: 'Americano', price: 300, category: 'Coffee', image: '☕' },
  { id: 'p5', name: 'Croissant', price: 275, category: 'Pastry', image: '🥐' },
  { id: 'p6', name: 'Muffin', price: 250, category: 'Pastry', image: '🧁' },
  { id: 'p7', name: 'Bagel', price: 300, category: 'Pastry', image: '🥯' },
  { id: 'p8', name: 'Iced Tea', price: 275, category: 'Cold Drinks', image: '🧊' },
  { id: 'p9', name: 'Lemonade', price: 325, category: 'Cold Drinks', image: '🍋' },
  { id: 'p10', name: 'Water', price: 150, category: 'Cold Drinks', image: '💧' }
]

function App() {
  const cart = useCart()
  const [products] = useState<Product[]>(MOCK_PRODUCTS)
  const [category, setCategory] = useState('All')
  const [showCheckout, setShowCheckout] = useState(false)
  const [orders, setOrders] = useLocalStorage<Order[]>('pos-orders', [])

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handleCompleteOrder = (method: PaymentMethod, cashReceived?: number) => {
    const order: Order = {
      id: nanoid(),
      items: cart.items,
      subtotal: cart.subtotal(),
      tax: cart.tax(),
      total: cart.total(),
      paymentMethod: method,
      cashReceived,
      change: cashReceived? cashReceived - cart.total() : undefined,
      createdAt: new Date().toISOString(),
      cashierId: 'user_1'
    }
    setOrders([order,...orders])
    cart.clearCart()
    setShowCheckout(false)
    alert(`Order ${order.id} completed!`)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{import.meta.env.VITE_STORE_NAME}</h1>
          <div className="text-sm text-gray-600">
            {orders.length} orders today
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <ProductGrid
            products={products}
            onAddToCart={cart.addItem}
            category={category}
            onCategoryChange={setCategory}
          />
        </div>
        <CartPanel
          items={cart.items}
          subtotal={cart.subtotal()}
          tax={cart.tax()}
          total={cart.total()}
          onUpdateQuantity={cart.updateQuantity}
          onCheckout={handleCheckout}
          onClear={cart.clearCart}
        />
      </div>

      {showCheckout && (
        <CheckoutModal
          total={cart.total()}
          onComplete={handleCompleteOrder}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  )
}

export default App