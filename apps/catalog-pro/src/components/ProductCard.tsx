import { formatCurrency, cn } from '@repo/utils'

export type ProductVariant = {
  id: string
  sku: string
  name: string
  price: number
  inventory: number
  attributes: Record<string, string> // { "Color": "Black", "Size": "M" }
  imageUrl?: string
}

export type Product = {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'draft' | 'archived'
  thumbnail: string
  variants: ProductVariant[]
  createdAt: string
}

type ProductCardProps = {
  product: Product
  onEdit: (productId: string) => void
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const totalInventory = product.variants.reduce((sum, v) => sum + v.inventory, 0)
  const priceRange = () => {
    const prices = product.variants.map(v => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <span className={cn(
          'absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium',
          product.status === 'active' && 'bg-green-100 text-green-700',
          product.status === 'draft' && 'bg-yellow-100 text-yellow-700',
          product.status === 'archived' && 'bg-gray-100 text-gray-700'
        )}>
          {product.status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold truncate">{product.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.category}</p>

        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="font-bold">{priceRange()}</p>
            <p className="text-xs text-gray-500">{product.variants.length} variants</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{totalInventory}</p>
            <p className="text-xs text-gray-500">in stock</p>
          </div>
        </div>

        <button
          onClick={() => onEdit(product.id)}
          className="w-full mt-4 px-3 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
        >
          Edit Product
        </button>
      </div>
    </div>
  )
}