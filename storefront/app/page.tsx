'use client'

import { useState, useEffect } from 'react'
import { ProductGrid } from '../components/products/ProductGrid'

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

export default function HomePage() {
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-text">Secrets Shop</h1>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-hero mb-6">
            Premium Secrets Shop
          </h1>
          <p className="text-body-large mb-8 opacity-90 max-w-2xl mx-auto">
            Free UK Delivery on orders over £40 • Discreet packaging • Fast shipping • Exceptional service
          </p>

          <button className="btn-primary bg-white text-primary hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-section mb-4">Featured Products</h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              Discover our premium collection of adult products, carefully selected for quality and satisfaction.
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>
      </section>

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
