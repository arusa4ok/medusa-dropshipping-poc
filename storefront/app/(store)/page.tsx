import { ProductGrid } from '@/components/products/ProductGrid'
import { Hero } from '@/components/layout/Hero'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
      <Hero />

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <ProductGrid />
      </section>
    </div>
  )
}
