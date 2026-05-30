import { Product } from '../types/pos'
import { formatCurrency } from '@repo/utils'

type ProductGridProps = {
  products: Product[]
  onAddToCart: (product: Product) => void
  category: string
  onCategoryChange: (category: string) => void
}

export function ProductGrid({ products, onAddToCart, category, onCategoryChange }: ProductGridProps) {
  const categories = ['All',...Array.from(new Set(products.map(p => p.category)))]
  const filtered = category === 'All'? products : products.filter(p => p.category === category)

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4 border-b bg-white overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              category === cat
             ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow text-left"
            >
              <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center text-4xl">
                {product.image || '☕'}
              </div>
              <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
              <p className="text-lg font-bold">{formatCurrency(product.price / 100)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}