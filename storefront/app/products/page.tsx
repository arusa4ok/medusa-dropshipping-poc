'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductGrid } from '../../components/products/ProductGrid'

interface Product {
  id: string;
  title: string;
  brand?: string;
  thumbnail: string;
  variants: Array<{
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
  }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/store/products', {
        headers: {
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
        }
      })
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (productId: string) => {
    alert(`Added product ${productId} to cart!`)
  }

  const handleToggleWishlist = (productId: string) => {
    alert(`Toggled wishlist for product ${productId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-text-secondary hover:text-text">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-text">Secrets Shop - Products</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-text-secondary hover:text-text transition-colors">
                Sign In
              </button>
              <button className="btn-primary">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-section mb-4">Our Premium Collection</h1>
            <p className="text-body text-text-secondary max-w-2xl">
              Discover our exclusive selection of adult products, carefully curated for quality and satisfaction.
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />

          {/* Load More */}
          {products.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-primary">
                Load More Products
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-text text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">Secrets Shop</span>
            </div>
            <p className="text-gray-400 mb-4">Your trusted source for premium adult products</p>
            <p className="text-sm text-gray-500">© 2025 Secrets Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
