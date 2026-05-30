import { Vendor } from '../types/vendor'
import { formatCurrency } from '@repo/utils'
import { formatDistanceToNow } from 'date-fns'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
}

type VendorTableProps = {
  vendors: Vendor[]
  onSelect: (vendor: Vendor) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function VendorTable({ vendors, onSelect, onApprove, onReject }: VendorTableProps) {
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-3 font-medium">Vendor</th>
            <th className="text-left p-3 font-medium">Email</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Terms</th>
            <th className="text-left p-3 font-medium">W-9</th>
            <th className="text-left p-3 font-medium">Created</th>
            <th className="text-right p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <button onClick={() => onSelect(vendor)} className="text-left hover:text-blue-600">
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-xs text-gray-500">{vendor.categories.join(', ')}</p>
                </button>
              </td>
              <td className="p-3 text-gray-600">{vendor.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[vendor.status]}`}>
                  {vendor.status}
                </span>
              </td>
              <td className="p-3">{vendor.paymentTerms}</td>
              <td className="p-3">
                <span className={`text-xs ${
                  vendor.w9Status === 'verified'? 'text-green-600' : 'text-gray-500'
                }`}>
                  {vendor.w9Status}
                </span>
              </td>
              <td className="p-3 text-gray-600 text-xs">
                {formatDistanceToNow(new Date(vendor.createdAt), { addSuffix: true })}
              </td>
              <td className="p-3 text-right">
                {vendor.status === 'pending' && (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onApprove(vendor.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(vendor.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}