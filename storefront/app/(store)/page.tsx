import { ProductGrid } from '@/components/products/ProductGrid'
import { Hero } from '@/components/layout/Hero'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <ProductGrid />
      </section>
    </div>
  )
}
