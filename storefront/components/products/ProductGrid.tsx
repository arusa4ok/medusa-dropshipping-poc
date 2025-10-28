import React from 'react';
import { ProductCard } from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card bg-white rounded-lg shadow-sm animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          brand={product.brand}
          image={product.thumbnail}
          originalPrice={product.variants?.[0]?.prices?.[0]?.amount ? product.variants[0].prices[0].amount / 100 : undefined}
          salePrice={product.variants?.[0]?.prices?.[0]?.amount ? product.variants[0].prices[0].amount / 100 : 29.99}
          onAddToCart={() => onAddToCart?.(product.id)}
          onToggleWishlist={() => onToggleWishlist?.(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
