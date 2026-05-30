import { formatCurrency, cn } from '@repo/utils'

export type CartItem = {
  name: string
  price: number
  qty: number
}

export type CartEvent = {
  id: string
  userId: string
  userEmail: string
  cartValue: number
  items: CartItem[]
  createdAt: string
  recovered: boolean
  recoveredAt?: string
}

type CartTableProps = {
  carts: CartEvent[]
  onSendRecovery?: (cartId: string) => void
  isLoading?: boolean
}

export function CartTable({ carts, onSendRecovery, isLoading }: CartTableProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg bg-white p-8 text-center text-gray-500">
        Loading carts...
      </div>
    )
  }

  if (carts.length === 0) {
    return (
      <div className="border rounded-lg bg-white p-8 text-center text-gray-500">
        No abandoned carts found for this period
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-700">Customer</th>
              <th className="text-left p-3 font-medium text-gray-700">Value</th>
              <th className="text-left p-3 font-medium text-gray-700">Items</th>
              <th className="text-left p-3 font-medium text-gray-700">Abandoned</th>
              <th className="text-left p-3 font-medium text-gray-700">Status</th>
              <th className="text-right p-3 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr key={cart.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium">{cart.userEmail}</div>
                  <div className="text-xs text-gray-500">ID: {cart.userId}</div>
                </td>
                <td className="p-3 font-semibold">
                  {formatCurrency(cart.cartValue)}
                </td>
                <td className="p-3 text-gray-600">
                  <div>{cart.items.length} products</div>
                  <div className="text-xs truncate max-w-">
                    {cart.items.map(i => i.name).join(', ')}
                  </div>
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(cart.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="p-3">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    cart.recovered
                     ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}>
                    {cart.recovered? 'Recovered' : 'Abandoned'}
                  </span>
                  {cart.recovered && cart.recoveredAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(cart.recoveredAt).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="p-3 text-right">
                  {!cart.recovered && onSendRecovery && (
                    <button
                      onClick={() => onSendRecovery(cart.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Send email
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}