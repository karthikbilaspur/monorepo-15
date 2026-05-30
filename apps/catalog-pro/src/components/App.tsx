import { useState, useMemo } from 'react'
import { Button } from '@repo/ui'
import { useLocalStorage, useDebounce } from '@repo/hooks'
import { ProductCard, type Product } from './components/ProductCard'

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Pro Wireless Headphones',
    description: 'Noise cancelling, 40hr battery',
    category: 'Audio',
    status: 'active',
    thumbnail: 'https://picsum.photos/seed/headphones/400',
    createdAt: '2026-05-20T10:00:00Z',
    variants: [
      { id: 'v1', sku: 'WH-BLK', name: 'Black', price: 249.99, inventory: 45, attributes: { Color: 'Black' }, imageUrl: 'https://picsum.photos/seed/headphones-black/400' },
      { id: 'v2', sku: 'WH-WHT', name: 'White', price: 249.99, inventory: 12, attributes: { Color: 'White' }, imageUrl: 'https://picsum.photos/seed/headphones-white/400' },
      { id: 'v3', sku: 'WH-BLU', name: 'Blue', price: 269.99, inventory: 0, attributes: { Color: 'Blue' }, imageUrl: 'https://picsum.photos/seed/headphones-blue/400' }
    ]
  },
  {
    id: 'p2',
    title: 'Minimalist T-Shirt',
    description: '100% organic cotton',
    category: 'Apparel',
    status: 'active',
    thumbnail: 'https://picsum.photos/seed/tshirt/400',
    createdAt: '2026-05-18T14:30:00Z',
    variants: [
      { id: 'v4', sku: 'TS-BLK-S', name: 'Black S', price: 29.99, inventory: 120, attributes: { Color: 'Black', Size: 'S' } },
      { id: 'v5', sku: 'TS-BLK-M', name: 'Black M', price: 29.99, inventory: 89, attributes: { Color: 'Black', Size: 'M' } },
      { id: 'v6', sku: 'TS-WHT-M', name: 'White M', price: 29.99, inventory: 0, attributes: { Color: 'White', Size: 'M' } }
    ]
  },
  {
    id: 'p3',
    title: 'Mechanical Keyboard',
    description: 'Hot-swappable switches',
    category: 'Peripherals',
    status: 'draft',
    thumbnail: 'https://picsum.photos/seed/keyboard/400',
    createdAt: '2026-05-15T09:00:00Z',
    variants: [
      { id: 'v7', sku: 'KB-BROWN', name: 'Brown Switch', price: 149.99, inventory: 30, attributes: { Switch: 'Brown' } },
      { id: 'v8', sku: 'KB-RED', name: 'Red Switch', price: 149.99, inventory: 18, attributes: { Switch: 'Red' } }
    ]
  }
]

type StatusFilter = 'all' | 'active' | 'draft' | 'archived'

function App() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS)
  const [search, setSearch] = useLocalStorage('catalog-search', '')
  const [statusFilter, setStatusFilter] = useLocalStorage<StatusFilter>('catalog-status', 'all')
  const debouncedSearch = useDebounce(search, 300)

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           p.variants.some(v => v.sku.toLowerCase().includes(debouncedSearch.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [products, debouncedSearch, statusFilter])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0)
    const totalInventory = products.reduce((sum, p) =>
      sum + p.variants.reduce((vSum, v) => vSum + v.inventory, 0), 0
    )
    return { totalProducts, totalVariants, totalInventory }
  }, [products])

  const handleEdit = (productId: string) => {
    console.log('Edit product:', productId)
    // TODO: open edit modal
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Catalog Pro</h1>
            <p className="text-gray-600 mt-1">Manage products and variants</p>
          </div>
          <Button style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: 6 }}>
            + Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6 bg-white">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
          </div>
          <div className="border rounded-lg p-6 bg-white">
            <p className="text-sm text-gray-600">Total Variants</p>
            <p className="text-3xl font-bold mt-2">{stats.totalVariants}</p>
          </div>
          <div className="border rounded-lg p-6 bg-white">
            <p className="text-sm text-gray-600">Items in Stock</p>
            <p className="text-3xl font-bold mt-2">{stats.totalInventory}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w- px-3 py-2 border rounded-md"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onEdit={handleEdit} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found matching your filters
          </div>
        )}
      </div>
    </div>
  )
}

export default App