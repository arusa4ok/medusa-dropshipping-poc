import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { PriceDisplay, PriceWithDiscount } from '@/components/ui/PriceDisplay'
import medusaClient from '@/lib/medusa'

interface ProductPageProps {
  params: {
    handle: string
  }
}

async function getProduct(handle: string) {
  try {
    const { products } = await medusaClient.products.list({ handle })
    return products[0]
  } catch (error) {
    return null
  }
}

async function getRelatedProducts(productId: string) {
  try {
    const { products } = await medusaClient.products.list({ limit: 8 })
    return products.filter(p => p.id !== productId).slice(0, 4)
  } catch (error) {
    return []
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id)
  const imageUrl = product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png'
  const price = product.variants?.[0]?.prices?.find(p => p.currency_code === 'gbp' || p.currency_code === 'usd')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg">
            {/* TODO: Add image gallery */}
            <p className="flex items-center justify-center h-full text-gray-600">
              Product: {handle}
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Product Title</h1>
          <p className="text-2xl font-semibold mb-4">$99.99</p>

          <p className="text-gray-600 mb-6">
            Product description will be displayed here...
          </p>

          {/* Variant Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Size</h3>
            {/* TODO: Add variant selector */}
          </div>

          {/* Add to Cart */}
          <button className="btn btn-primary w-full mb-4">
            Add to Cart
          </button>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            {/* TODO: Add product details */}
          </div>
        </div>
      </div>
    </div>
  )
}
