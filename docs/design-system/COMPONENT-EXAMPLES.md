# Ready-to-Use Component Code Examples

Copy and paste these components directly into your project!

---

## 1. Button Component

**File: `components/ui/Button.tsx`**

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded transition-colors duration-300 cursor-pointer inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400',
    secondary: 'border-2 border-primary text-primary hover:bg-primary-light disabled:border-gray-400 disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
```

---

## 2. Price Display Component

**File: `components/ui/PriceDisplay.tsx`**

```typescript
import React from 'react';

interface PriceDisplayProps {
  originalPrice: number;
  salePrice: number;
  showDiscount?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  salePrice,
  showDiscount = true,
}) => {
  const discountPercent = Math.round(
    ((originalPrice - salePrice) / originalPrice) * 100
  );

  return (
    <div className="flex flex-col gap-1">
      {originalPrice > salePrice && (
        <p className="text-xs md:text-sm text-text-secondary line-through">
          £{originalPrice.toFixed(2)}
        </p>
      )}
      <p className="text-lg md:text-2xl font-bold text-primary">
        £{salePrice.toFixed(2)}
      </p>
      {showDiscount && originalPrice > salePrice && (
        <span className="text-xs font-semibold text-primary">
          Save {discountPercent}%
        </span>
      )}
    </div>
  );
};
```

---

## 3. Star Rating Component

**File: `components/ui/StarRating.tsx`**

```typescript
import React from 'react';

interface StarRatingProps {
  rating: number; // 0-5
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 'md',
}) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const starSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${starSize[size]} text-yellow-400`}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className="leading-none">
            {i < Math.round(rating) ? '★' : '☆'}
          </span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className={`text-text-secondary ${sizes[size]}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
```

---

## 4. Product Card Component

**File: `components/products/ProductCard.tsx`**

```typescript
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StarRating } from '@/components/ui/StarRating';
import { Heart, BarChart2 } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  image: string;
  brand: string;
  title: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  salePrice: number;
  inStock: boolean;
  onAddToCart?: (id: string) => void;
  onWishlist?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  brand,
  title,
  rating,
  reviewCount,
  originalPrice,
  salePrice,
  inStock,
  onAddToCart,
  onWishlist,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onWishlist?.(id);
  };

  return (
    <div className="bg-white border border-border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-semibold z-10">
            - {discount}%
          </div>
        )}

        {/* Wishlist Icon */}
        <button
          className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-primary-light transition-colors z-10"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={isWishlisted ? 'text-primary fill-primary' : 'text-primary'}
          />
        </button>

        {/* Compare Icon */}
        <button
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 hover:bg-primary-light transition-colors z-10"
          aria-label="Compare"
        >
          <BarChart2 size={18} className="text-primary" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Brand */}
        <p className="text-xs uppercase text-text-secondary font-semibold mb-2">
          {brand}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text mb-3 line-clamp-2 h-10">
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
        </div>

        {/* Price */}
        <div className="mb-4">
          <PriceDisplay
            originalPrice={originalPrice}
            salePrice={salePrice}
            showDiscount={true}
          />
        </div>

        {/* Button */}
        <Button
          variant="primary"
          size="md"
          onClick={() => onAddToCart?.(id)}
          disabled={!inStock}
          className="w-full mt-auto"
        >
          {inStock ? 'Add to Basket' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};
```

---

## 5. Product Grid Component

**File: `components/products/ProductGrid.tsx`**

```typescript
import React from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';

interface ProductGridProps {
  products: ProductCardProps[];
  onAddToCart?: (id: string) => void;
  onWishlist?: (id: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onWishlist,
}) => {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-text-secondary">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={onAddToCart}
          onWishlist={onWishlist}
        />
      ))}
    </div>
  );
};
```

---

## 6. Search Bar Component

**File: `components/ui/SearchBar.tsx`**

```typescript
import React, { useState, FormEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search through 7000+ products...',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-lg">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-10 border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};
```

---

## 7. Header/Navigation Component

**File: `components/layout/Header.tsx`**

```typescript
import React, { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/ui/SearchBar';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Main Header */}
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-primary">
              💝 Secrets
            </div>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar onSearch={(query) => console.log(query)} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative hover:text-primary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              href="/account"
              className="hover:text-primary transition-colors hidden sm:block"
              aria-label="My account"
            >
              <User size={24} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Shown on Mobile */}
        <div className="md:hidden mt-4">
          <SearchBar onSearch={(query) => console.log(query)} />
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className="border-t border-border hidden md:block bg-background">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex gap-6 py-3 text-sm">
            <Link href="/sex-toys" className="hover:text-primary transition-colors">
              Sex Toys
            </Link>
            <Link href="/bondage" className="hover:text-primary transition-colors">
              Bondage & Fetish
            </Link>
            <Link href="/essentials" className="hover:text-primary transition-colors">
              Essentials
            </Link>
            <Link href="/lingerie" className="hover:text-primary transition-colors">
              Lingerie
            </Link>
            <Link href="/offers" className="hover:text-primary transition-colors font-semibold text-primary">
              Offers
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
```

---

## 8. Footer Component

**File: `components/layout/Footer.tsx`**

```typescript
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border mt-16 md:mt-24">
      <div className="px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-text mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <Link href="/help" className="hover:text-primary transition-colors">
                    Help & Contact
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" className="hover:text-primary transition-colors">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-primary transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-primary transition-colors">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-text mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Secrets
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-primary transition-colors">
                    Jobs at Secrets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular */}
            <div>
              <h3 className="font-semibold text-text mb-4">Popular</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <Link href="/vibrators" className="hover:text-primary transition-colors">
                    Vibrators
                  </Link>
                </li>
                <li>
                  <Link href="/dildos" className="hover:text-primary transition-colors">
                    Dildos
                  </Link>
                </li>
                <li>
                  <Link href="/anal" className="hover:text-primary transition-colors">
                    Anal Sex Toys
                  </Link>
                </li>
                <li>
                  <Link href="/couples" className="hover:text-primary transition-colors">
                    Couples Sex Toys
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-text mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-primary transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Contact Info */}
            <div className="text-center md:text-left">
              <p className="text-sm text-text-secondary mb-2">
                📞 020 7078 8745
              </p>
              <p className="text-sm text-text-secondary">
                📧 service@secrets-shop.co.uk
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="text-text-secondary hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-text-secondary hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-text-secondary hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-8 border-t border-border text-xs text-text-secondary">
            <p>© 2025 Secrets Shop. All rights reserved.</p>
            <p>Secrets Shop® is a registered trademark of APA Trading limited.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

---

## 9. Home Page Example

**File: `app/page.tsx`**

```typescript
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';

const mockProducts = [
  {
    id: '1',
    image: 'https://via.placeholder.com/400x400?text=Satisfyer+Pro+2',
    brand: 'Satisfyer',
    title: 'Pro 2 Next Generation Air Pulse Clitoral Stimulator Pink',
    rating: 5,
    reviewCount: 7,
    originalPrice: 59.95,
    salePrice: 39.45,
    inStock: true,
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/400x400?text=LELO+Sona+2',
    brand: 'LELO',
    title: 'Sona 2 Clitoral Vibrator Purple',
    rating: 4,
    reviewCount: 23,
    originalPrice: 98.95,
    salePrice: 69.95,
    inStock: true,
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/400x400?text=Doxy+Original',
    brand: 'Doxy',
    title: 'Original Wand Massager Black',
    rating: 5,
    reviewCount: 45,
    originalPrice: 89.99,
    salePrice: 74.95,
    inStock: true,
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/400x400?text=Fifty+Shades',
    brand: 'Fifty Shades of Grey',
    title: 'Greedy Girl G Spot Rabbit Vibrator',
    rating: 4,
    reviewCount: 18,
    originalPrice: 89.99,
    salePrice: 59.95,
    inStock: true,
  },
];

export default function Home() {
  const handleAddToCart = (id: string) => {
    console.log(`Added product ${id} to cart`);
  };

  const handleWishlist = (id: string) => {
    console.log(`Toggled wishlist for product ${id}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-24 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to Secrets Shop
            </h1>
            <p className="text-lg md:text-xl text-primary-light mb-8">
              Your online sexual wellness shop
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded font-semibold hover:bg-primary-light transition-colors">
              Shop Now
            </button>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Products</h2>
          <ProductGrid
            products={mockProducts}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
          />
        </section>

        {/* CTA Section */}
        <section className="bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Free UK Delivery on orders over £40
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Discreet packaging • Fast shipping • Exceptional service
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 10. Tailwind Config

**File: `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E91E8C',
        'primary-dark': '#D1157A',
        'primary-light': '#FFF0F7',
        text: '#1a1a1a',
        'text-secondary': '#666666',
        border: '#E0E0E0',
        background: '#F5F5F5',
        success: '#7FD856',
        warning: '#FF9800',
        error: '#F44336',
        info: '#00BCD4',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['15px', { lineHeight: '1.5' }],
        lg: ['16px', { lineHeight: '1.6' }],
        xl: ['18px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Installation

All components use these dependencies:

```bash
npm install react lucide-react next next-image-export-optimizer
```

Icons are from `lucide-react`. If you need different icons, see https://lucide.dev

---

## Quick Start

1. Copy the tailwind config to your project
2. Copy components to your `/components` directory
3. Import and use in your pages
4. Customize as needed!

All components are **fully typed with TypeScript** and **production-ready**! 🚀
