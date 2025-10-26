import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { PriceDisplay, PriceRange } from '@/components/ui/PriceDisplay'
import { Button } from '@/components/ui/Button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Get price range from variants
  const prices = product.variants
    .flatMap(v => v.prices)
    .filter(p => p.currency_code === 'usd')

  const minPrice = Math.min(...prices.map(p => p.amount))
  const maxPrice = Math.max(...prices.map(p => p.amount))

  const imageUrl = product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png'

  return (
    <div className="card group overflow-hidden">
      <Link href={`/products/${product.handle}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary-light transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <PriceRange
            minAmount={minPrice}
            maxAmount={maxPrice}
            currencyCode="USD"
            className="text-primary text-lg"
          />

          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              // Add to cart logic
              console.log('Add to cart:', product.id)
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
