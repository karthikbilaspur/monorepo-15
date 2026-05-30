import { CartItem } from '../types/pos'
import { formatCurrency } from '@repo/utils'
import { cn } from '@repo/utils'

type CartPanelProps = {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  onUpdateQuantity: (productId: string, quantity: number) => void
  onCheckout: () => void
  onClear: () => void
}

export function CartPanel({ items, subtotal, tax, total, onUpdateQuantity, onCheckout, onClear }: CartPanelProps) {
  return (
    <div className="w-96 border-l bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Current Order</h2>
          {items.length > 0 && (
            <button onClick={onClear} className="text-sm text-red-600 hover:text-red-800">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Cart is empty</p>
            <p className="text-sm mt-2">Add items to start</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.productId} className="bg-gray-50 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(item.product.price / 100)} each</p>
                  </div>
                  <p className="font-bold text-sm ml-2">
                    {formatCurrency((item.product.price * item.quantity) / 100)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded border bg-white hover:bg-gray-100 text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded border bg-white hover:bg-gray-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal / 100)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatCurrency(tax / 100)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total / 100)}</span>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  )
}