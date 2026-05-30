import { useState } from 'react'
import { useLocalStorage } from '@repo/hooks'
import { nanoid } from 'nanoid'
import { VendorOnboardingForm } from './components/VendorOnboardingForm'
import { VendorTable } from './components/VendorTable'
import { Vendor, VendorStatus } from './types/vendor'

type View = 'list' | 'onboard' | 'detail'

function App() {
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('vender-vendors', [])
  const [view, setView] = useState<View>('list')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  const handleOnboard = (data: any) => {
    const vendor: Vendor = {
      id: nanoid(),
      ...data,
      status: 'pending',
      w9Status: 'not_uploaded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setVendors([vendor,...vendors])
    setView('list')
    alert('Vendor submitted for approval')
  }

  const handleApprove = (id: string) => {
    setVendors(vendors.map(v =>
      v.id === id
     ? {...v, status: 'approved' as VendorStatus, approvedAt: new Date().toISOString() }
        : v
    ))
  }

  const handleReject = (id: string) => {
    setVendors(vendors.map(v =>
      v.id === id? {...v, status: 'rejected' as VendorStatus } : v
    ))
  }

  const pendingCount = vendors.filter(v => v.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Vender Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              {vendors.length} vendors • {pendingCount} pending approval
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                view === 'list'? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
              }`}
            >
              All Vendors
            </button>
            <button
              onClick={() => setView('onboard')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                view === 'onboard'? 'bg-gray-900 text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              + New Vendor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {view === 'list' && (
          <VendorTable
            vendors={vendors}
            onSelect={setSelectedVendor}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {view === 'onboard' && (
          <VendorOnboardingForm onSubmit={handleOnboard} />
        )}
      </div>
    </div>
  )
}

export default App