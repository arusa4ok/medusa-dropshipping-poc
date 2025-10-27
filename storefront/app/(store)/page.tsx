import { ProductGrid } from '@/components/products/ProductGrid'
import { Hero } from '@/components/layout/Hero'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of premium dropshipping products
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>
    </div>
  )
}
