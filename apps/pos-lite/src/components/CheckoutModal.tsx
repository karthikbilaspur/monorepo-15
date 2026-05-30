import { useState } from 'react'
import { PaymentMethod } from '../types/pos'
import { formatCurrency } from '@repo/utils'

type CheckoutModalProps = {
  total: number
  onComplete: (method: PaymentMethod, cashReceived?: number) => void
  onClose: () => void
}

export function CheckoutModal({ total, onComplete, onClose }: CheckoutModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [cashReceived, setCashReceived] = useState('')
  const totalDollars = total / 100
  const cashAmount = Number(cashReceived) || 0
  const change = cashAmount - totalDollars

  const handleComplete = () => {
    if (method === 'cash' && cashAmount < totalDollars) return
    onComplete(method, method === 'cash'? cashAmount * 100 : undefined)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Total Due</p>
          <p className="text-4xl font-bold">{formatCurrency(totalDollars)}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            {(['cash', 'card', 'other'] as PaymentMethod[]).map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`py-3 rounded border font-medium capitalize ${
                  method === m
                 ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {method === 'cash' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Cash Received</label>
            <input
              type="number"
              step="0.01"
              value={cashReceived}
              onChange={e => setCashReceived(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border rounded text-lg"
              autoFocus
            />
            {cashAmount >= totalDollars && (
              <p className="mt-2 text-sm">
                Change: <span className="font-bold text-green-600">{formatCurrency(change)}</span>
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={method === 'cash' && cashAmount < totalDollars}
            className="flex-1 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  )
}