# How to Use the Design System - Step-by-Step Guide

## Method 1: Using Cursor IDE (Recommended for Beginners)

### Step 1: Install Cursor
- Download from https://www.cursor.com/
- Free editor built for AI-assisted development

### Step 2: Create a New Next.js Project
```bash
npx create-next-app@latest secrets-shop --typescript --tailwind
cd secrets-shop
```

### Step 3: Add Design System to Your Project
1. Copy the `tailwind.config.js` configuration from the design system document
2. Replace your existing `tailwind.config.js` file
3. Update your `globals.css` with the typography and spacing system

### Step 4: Use Cursor's AI Features
1. Open Cursor and create a new file `/components/ProductCard.tsx`
2. Paste this prompt in Cursor's chat:

```
Use this design system to create a ProductCard component in Next.js with TailwindCSS:

[PASTE THE DESIGN SYSTEM CONTENT HERE]

Create a fully functional ProductCard component that:
- Displays product image with aspect ratio 1:1
- Shows brand name in uppercase (12px)
- Shows product title (16px, 600 weight)
- Displays star rating with review count
- Shows original price (strikethrough) and sale price (magenta, bold)
- Shows discount badge (e.g., "- 34%")
- Has "Add to Basket" button that spans full width
- Has wishlist/compare icons in top right
- Includes hover effects (shadow increase, image zoom)
- Accept props: id, image, brand, title, rating, reviewCount, originalPrice, salePrice, discount, inStock
```

3. Cursor will generate the component code
4. Review and adjust as needed

### Step 5: Create More Components
Repeat Step 4 for:
- Navigation/Header
- Search Bar
- Filter Sidebar
- Price Display
- Button component
- Card component

---

## Method 2: Using Windsurf IDE

### Step 1: Install Windsurf
- Download from https://codeium.com/windsurf
- Similar to Cursor but with more advanced features

### Step 2: Create Project Structure
```bash
npx create-next-app@latest secrets-shop --typescript --tailwind
```

### Step 3: Create a Design System Folder
```bash
mkdir -p app/lib/design-system
mkdir -p components/ui
mkdir -p components/products
mkdir -p app/styles
```

### Step 4: Set Up Tailwind Config
- Replace `tailwind.config.ts` with the config from the design system
- Update `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Typography */
@layer base {
  h1 {
    @apply text-3xl md:text-4xl font-bold leading-tight;
  }
  h2 {
    @apply text-2xl md:text-3xl font-bold leading-tight;
  }
  h3 {
    @apply text-xl md:text-2xl font-semibold leading-relaxed;
  }
  p {
    @apply text-base leading-relaxed text-text;
  }
}

/* Component Utilities */
@layer components {
  .btn-primary {
    @apply bg-primary text-white px-8 py-3 rounded transition-colors duration-300 hover:bg-primary-dark font-semibold;
  }
  .btn-secondary {
    @apply border-2 border-primary text-primary px-8 py-3 rounded transition-colors duration-300 hover:bg-primary-light font-semibold;
  }
  .card {
    @apply bg-white border border-border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300;
  }
  .badge {
    @apply bg-primary text-white px-3 py-1 rounded text-xs font-semibold;
  }
}
```

### Step 5: Use Windsurf's Flow Mode
1. Open Windsurf
2. Click "Flow" (bottom right)
3. Paste your prompt:

```
I have a design system document for an e-commerce site (Secrets Shop).
Help me build the following components using Next.js 15, TypeScript, and TailwindCSS:

1. ProductCard - displays products with images, prices, and ratings
2. ProductGrid - responsive grid layout (4 cols desktop, 3 tablet, 2 mobile)
3. FilterSidebar - category, price range, brand filters
4. NavigationHeader - logo, search, cart icons
5. PriceDisplay - original/sale price with discount badge

Use this design system: [PASTE DESIGN SYSTEM]

Generate clean, reusable, type-safe components with proper prop interfaces.
```

4. Windsurf will generate all components at once

---

## Method 3: Using ChatGPT/Claude API

### Step 1: Create Project
```bash
npx create-next-app@latest secrets-shop --typescript --tailwind
```

### Step 2: Prepare Your Prompts
Create a file `prompts/component-requests.txt` with:

```
CONTEXT:
You are helping build an e-commerce site using Next.js, TypeScript, and TailwindCSS.
Follow this design system exactly: [PASTE FULL DESIGN SYSTEM]

REQUEST 1: ProductCard Component
Create a ProductCard component that:
- Props: id, image, brand, title, rating, reviewCount, originalPrice, salePrice, discount, inStock, onAddToCart, onWishlist
- Display product image with 1:1 aspect ratio
- Show all information as per design system
- Include hover effects
- Be fully responsive

OUTPUT: TypeScript React component code only.
```

### Step 3: Use These AI Tools
- **Claude API**: https://docs.claude.com
- **ChatGPT**: https://chat.openai.com
- **Gemini**: https://gemini.google.com

Paste your design system + component request, and get the code

---

## Method 4: Step-by-Step Manual Implementation

### Step 1: Setup
```bash
npx create-next-app@latest secrets-shop --typescript --tailwind
cd secrets-shop
```

### Step 2: Update tailwind.config.ts
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

### Step 3: Create Component Files
```bash
mkdir -p components/ui
mkdir -p components/products
mkdir -p components/layout
mkdir -p lib/types
```

### Step 4: Create Types File
```typescript
// lib/types/product.ts
export interface Product {
  id: string;
  image: string;
  brand: string;
  title: string;
  rating: number; // 0-5
  reviewCount: number;
  originalPrice: number;
  salePrice: number;
  discount?: number;
  inStock: boolean;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  selectedFilters: Record<string, string[]>;
}
```

### Step 5: Create Button Component
```typescript
// components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded transition-colors duration-300';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'border-2 border-primary text-primary hover:bg-primary-light',
  };

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Step 6: Create ProductCard Component
```typescript
// components/products/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types/product';
import { Heart, BarChart2 } from 'lucide-react';

interface ProductCardProps extends Product {
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
  discount,
  inStock,
  onAddToCart,
  onWishlist,
}) => {
  return (
    <div className="bg-white border border-border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
            - {discount}%
          </div>
        )}

        {/* Wishlist Icon */}
        <button
          className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-primary-light transition-colors"
          onClick={() => onWishlist?.(id)}
          aria-label="Add to wishlist"
        >
          <Heart size={18} className="text-primary" />
        </button>

        {/* Compare Icon */}
        <button
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 hover:bg-primary-light transition-colors"
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
        <h3 className="text-sm font-semibold text-text mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
          <span className="text-xs text-text-secondary">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          {originalPrice > salePrice && (
            <p className="text-xs text-text-secondary line-through">
              £{originalPrice.toFixed(2)}
            </p>
          )}
          <p className="text-lg font-bold text-primary">
            £{salePrice.toFixed(2)}
          </p>
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

### Step 7: Create ProductGrid Component
```typescript
// components/products/ProductGrid.tsx
import React from 'react';
import { Product } from '@/lib/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (id: string) => void;
  onWishlist?: (id: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onWishlist,
}) => {
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

### Step 8: Use in Page
```typescript
// app/page.tsx
import { ProductGrid } from '@/components/products/ProductGrid';

const mockProducts = [
  {
    id: '1',
    image: '/products/satisfyer-pro-2.jpg',
    brand: 'Satisfyer',
    title: 'Pro 2 Next Generation Air Pulse Clitoral Stimulator Pink',
    rating: 5,
    reviewCount: 7,
    originalPrice: 59.95,
    salePrice: 39.45,
    discount: 34,
    inStock: true,
  },
  // ... more products
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Featured Products</h1>
        <ProductGrid products={mockProducts} />
      </div>
    </main>
  );
}
```

---

## Quick Reference: Common Tasks

### 1. Create a New Component
- Create file in `/components/`
- Import types from `/lib/types/`
- Use design system colors via Tailwind classes
- Example: `className="bg-primary text-white px-lg py-md"`

### 2. Use Colors
```
bg-primary          // Magenta button
text-primary        // Magenta text
border-border       // Light gray border
bg-success          // Green background
text-text-secondary // Gray text
```

### 3. Use Spacing
```
p-md               // 16px padding
m-lg               // 24px margin
gap-4              // 16px gap (Tailwind default)
px-xl py-md        // 32px horizontal, 16px vertical
```

### 4. Use Typography
```
text-3xl font-bold                    // H1
text-2xl font-semibold                // H2
text-lg leading-relaxed               // Body Large
text-sm font-semibold                 // Button
```

### 5. Make Responsive
```
grid-cols-2 md:grid-cols-3 lg:grid-cols-4
px-4 md:px-6 lg:px-8
text-base md:text-lg lg:text-xl
```

---

## Recommended Development Flow

1. **Week 1**: Setup project + Create UI components (Button, Card, Badge)
2. **Week 2**: Create product components (ProductCard, ProductGrid, Filter)
3. **Week 3**: Build layout components (Header, Footer, Navigation)
4. **Week 4**: Create pages (Home, Product Details, Category, Cart)
5. **Week 5**: Add functionality (cart, wishlist, filters)
6. **Week 6**: Testing, optimization, deployment

---

## Tools You'll Need

- **Editor**: Cursor or Windsurf (with AI)
- **Package Manager**: npm or yarn
- **Icons**: `npm install lucide-react`
- **Image Optimization**: Next.js Image component (built-in)
- **Form Validation**: `npm install react-hook-form`
- **State Management**: React Context or `npm install zustand`
- **Database**: Supabase or Firebase (optional)

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Cursor Docs**: https://docs.cursor.com
- **Windsurf Docs**: https://docs.codeium.com/windsurf

---

Now you're ready to build! Start with Method 1 (Cursor) if you're new to this. Good luck! 🚀
