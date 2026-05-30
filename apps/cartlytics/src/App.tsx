import { useState, useMemo } from 'react'
import { Button } from '@repo/ui'
import { formatCurrency } from '@repo/utils'
import { useLocalStorage } from '@repo/hooks'
import { CartTable, type CartEvent } from './components/CartTable'
import { MetricsCard } from './components/MetricsCard'

type DateRange = '7d' | '30d' | '90d'

const MOCK_CARTS: CartEvent[] = [
  {
    id: '1',
    userId: 'u1',
    userEmail: 'sarah@example.com',
    cartValue: 249.99,
    items: [{ name: 'Wireless Headphones', price: 249.99, qty: 1 }],
    createdAt: '2026-05-27T10:30:00Z',
    recovered: true,
    recoveredAt: '2026-05-27T14:20:00Z'
  },
  {
    id: '2',
    userId: 'u2',
    userEmail: 'mike@example.com',
    cartValue: 89.5,
    items: [{ name: 'Phone Case', price: 29.5, qty: 1 }, { name: 'Screen Protector', price: 60, qty: 1 }],
    createdAt: '2026-05-26T08:15:00Z',
    recovered: false
  },
  {
    id: '3',
    userId: 'u3',
    userEmail: 'lisa@example.com',
    cartValue: 420.0,
    items: [{ name: 'Mechanical Keyboard', price: 420, qty: 1 }],
    createdAt: '2026-05-25T16:45:00Z',
    recovered: false
  }
]

function App() {
  const [dateRange, setDateRange] = useLocalStorage<DateRange>('cartlytics-range', '30d')
  const [carts] = useState<CartEvent[]>(MOCK_CARTS)

  const stats = useMemo(() => {
    const abandoned = carts.filter(c =>!c.recovered)
    const recovered = carts.filter(c => c.recovered)
    const totalLost = abandoned.reduce((sum, c) => sum + c.cartValue, 0)
    const totalRecovered = recovered.reduce((sum, c) => sum + c.cartValue, 0)
    const recoveryRate = carts.length? (recovered.length / carts.length) * 100 : 0
    return { totalLost, totalRecovered, recoveryRate, abandonedCount: abandoned.length }
  }, [carts])

  const handleSendRecovery = (cartId: string) => {
    console.log('Sending recovery email for cart:', cartId)
    // TODO: call API
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Cartlytics</h1>
            <p className="text-gray-600 mt-1">Abandoned cart analytics</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as DateRange[]).map(range => (
              <Button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  background: dateRange === range? '#000' : '#fff',
                  color: dateRange === range? '#fff' : '#000',
                  border: '1px solid #ddd',
                  padding: '8px 16px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Revenue Lost"
            value={formatCurrency(stats.totalLost)}
            subtext={`${stats.abandonedCount} carts`}
            trend={{ direction: 'down', value: '12%', label: 'vs last period' }}
          />
          <MetricsCard
            title="Revenue Recovered"
            value={formatCurrency(stats.totalRecovered)}
            trend={{ direction: 'up', value: '8%', label: 'vs last period' }}
          />
          <MetricsCard
            title="Recovery Rate"
            value={`${stats.recoveryRate.toFixed(1)}%`}
            trend={{ direction: 'up', value: '3.2%', label: 'vs last period' }}
          />
          <MetricsCard
            title="Total Carts"
            value={carts.length.toString()}
            trend={{ direction: 'neutral', value: '0%', label: 'vs last period' }}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Abandoned Carts</h2>
          <CartTable carts={carts} onSendRecovery={handleSendRecovery} />
        </div>
      </div>
    </div>
  )
}

export default App