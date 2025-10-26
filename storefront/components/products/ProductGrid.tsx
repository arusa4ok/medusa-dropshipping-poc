'use client'

import { useQuery } from '@tanstack/react-query'
import { ProductCard } from './ProductCard'
import medusaClient from '@/lib/medusa'

export function ProductGrid() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await medusaClient.products.list()
      return response.products
    },
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-background border border-border rounded-lg p-4 animate-pulse">
            <div className="aspect-square bg-background-light"></div>
            <div className="space-y-3">
              <div className="h-4 bg-background-light rounded w-3/4"></div>
              <div className="h-3 bg-background-light rounded w-full"></div>
              <div className="h-3 bg-background-light rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
