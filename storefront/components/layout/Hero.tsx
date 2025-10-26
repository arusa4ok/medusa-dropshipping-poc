import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-light text-white rounded-lg overflow-hidden">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Quality dropshipping products delivered to your door. Shop with confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button variant="accent" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="h-full w-full bg-[url('/pattern.svg')] bg-repeat"></div>
      </div>
    </section>
  )
}
