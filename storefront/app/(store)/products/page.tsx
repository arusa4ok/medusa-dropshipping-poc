import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilter } from '@/components/products/ProductFilter'

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">All Products</h1>
        <p className="text-lg text-text-secondary">
          Discover our complete collection of premium products
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar for filters */}
        <aside className="lg:w-80 flex-shrink-0">
          <ProductFilter />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
