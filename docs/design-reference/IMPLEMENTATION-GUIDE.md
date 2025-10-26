# Secrets Shop - Implementation Guide for Windsurf

## ✅ What's Already Done

Windsurf has already started implementing the design system:

### Updated Files:
1. ✅ `tailwind.config.ts` - Secrets Shop colors applied
   - Primary: `#E91E8C` (Magenta)
   - Text: `#1a1a1a` (Dark)
   - Background: `#FFFFFF` & `#F5F5F5`

2. ✅ `app/globals.css` - Typography and component utilities
   - Card styles
   - Button styles (btn-primary, btn-secondary)
   - Typography hierarchy (h1-h4, p)

3. ✅ `components/ui/PriceDisplay.tsx` - GBP currency, discount display
   - Added `PriceWithDiscount` component
   - Original price strikethrough
   - Sale price in magenta
   - Discount percentage

4. ✅ `components/ui/Button.tsx` - Updated variants
   - Primary and Secondary variants
   - Loading states
   - Size variants

5. ✅ `components/products/ProductCard.tsx` & `ProductGrid.tsx`
   - Basic structure in place

## 🎯 Next Steps for Windsurf

### Priority 1: Complete Product Card
**File:** `components/products/ProductCard.tsx`

The product card should match this design:

```tsx
<div className="card group">
  {/* Image with hover zoom */}
  <div className="relative aspect-square overflow-hidden">
    <Image
      src={image}
      fill
      className="transition-transform duration-300 group-hover:scale-105"
    />
    {/* Wishlist icon top-right */}
    <button className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full">
      ❤️
    </button>
    {/* Discount badge top-left */}
    {discount && (
      <span className="absolute top-2 left-2 badge">
        -{discount}%
      </span>
    )}
  </div>

  {/* Content */}
  <div className="p-4">
    {/* Brand/Category */}
    <p className="text-xs uppercase text-text-secondary mb-1">{brand}</p>

    {/* Title */}
    <h3 className="text-base font-semibold mb-2 line-clamp-2">{title}</h3>

    {/* Rating - TODO: Create Rating component */}
    <div className="flex items-center gap-1 mb-2">
      <span>⭐⭐⭐⭐⭐</span>
      <span className="text-xs text-text-secondary">({reviews})</span>
    </div>

    {/* Price */}
    <PriceWithDiscount
      originalPrice={originalPrice}
      salePrice={salePrice}
      showDiscount={true}
    />

    {/* Add to Basket */}
    <button className="btn-primary w-full mt-3">
      Add to Basket
    </button>
  </div>
</div>
```

**Windsurf command:**
```
Edit components/products/ProductCard.tsx
Implement the complete product card following the design above.
Use PriceWithDiscount component for pricing.
Add wishlist heart icon and discount badge.
Ensure hover effects work (image zoom, shadow increase).
```

### Priority 2: Create Rating Component
**File:** `components/ui/Rating.tsx` (needs to be created - ask Claude Code)

```tsx
interface RatingProps {
  rating: number // 0-5
  reviewCount?: number
  size?: 'small' | 'medium' | 'large'
}

// Display: ⭐⭐⭐⭐⭐ (4.5)
```

**Windsurf command:**
```
@Claude create components/ui/Rating.tsx

Then edit it to implement a 5-star rating display with:
- Gold stars (#FFB800)
- Half-star support
- Review count in gray
- Size variants (14px, 18px, 24px)
```

### Priority 3: Implement Product Grid Pagination
**File:** `components/products/ProductGrid.tsx`

Current grid works but needs:
- Pagination or infinite scroll
- Loading skeletons (already has!)
- Empty state improvements

**Windsurf command:**
```
Edit components/products/ProductGrid.tsx
Add pagination with 12 products per page.
Keep the existing loading skeleton.
Improve the empty state message.
```

### Priority 4: Complete Navigation Header
**File:** `components/layout/NavigationHeader.tsx`

Add missing elements:
- Search bar (center of header)
- Cart with item count
- Mobile hamburger menu

**Reference from design system:**
```tsx
<header className="sticky top-0 z-50 bg-background border-b border-border">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Logo />

      {/* Search Bar - Center */}
      <div className="hidden md:block flex-1 max-w-md mx-8">
        <input
          type="search"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-border rounded focus:border-primary"
        />
      </div>

      {/* Cart & Account */}
      <div className="flex items-center gap-4">
        <button className="relative">
          🛒
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </div>
</header>
```

**Windsurf command:**
```
Edit components/layout/NavigationHeader.tsx
Add a centered search bar between logo and cart.
Update cart button to show item count from cart store.
Make it responsive with mobile menu.
```

### Priority 5: Create Filter Sidebar
**File:** `components/products/ProductFilter.tsx`

Implement filters based on design system section 5.2:
- Categories (checkboxes)
- Price range (slider)
- Brands (list)
- Clear filters button

**Windsurf command:**
```
Edit components/products/ProductFilter.tsx
Implement working filters with:
- Category checkboxes
- Price range slider (min/max inputs for now)
- Brand list
- "Clear Filters" button at top
Follow the design system spacing and colors.
```

### Priority 6: Product Detail Page
**File:** `app/(store)/products/[handle]/page.tsx`

Implement full product detail page with:
- Large image gallery
- Product info (title, rating, price)
- Add to basket with quantity
- Product description tabs
- Related products

**Windsurf command:**
```
Edit app/(store)/products/[handle]/page.tsx
Fetch product by handle from Medusa API.
Create a 2-column layout (60% images, 40% info).
Display product details, pricing, and add to cart.
Use existing components where possible.
```

## 📋 Component Checklist

### ✅ Completed Components
- [x] Button (primary, secondary variants)
- [x] PriceDisplay (with discount support)
- [x] ProductGrid (basic with loading)
- [x] NavigationHeader (basic structure)
- [x] Footer
- [x] Hero

### 🔨 Need Implementation
- [ ] Rating component
- [ ] ProductFilter (working filters)
- [ ] ProductCard (complete with all features)
- [ ] Search bar in header
- [ ] Cart integration
- [ ] Product detail page
- [ ] Image gallery component
- [ ] Quantity selector
- [ ] Toast notifications
- [ ] Modal/Dialog component

### 📱 Responsive Design
- [ ] Mobile navigation menu
- [ ] Mobile filter drawer
- [ ] Responsive product grid (2-3-4 columns)
- [ ] Mobile-optimized product cards

## 🎨 Design System Quick Reference

### Colors (from tailwind.config.ts)
```tsx
bg-primary        // #E91E8C (Magenta)
bg-primary-light  // #FFF0F7 (Light magenta)
bg-primary-dark   // #D1157A (Dark magenta)
text-text         // #1a1a1a (Main text)
text-text-secondary // #666666 (Secondary text)
bg-background     // #FFFFFF (White)
bg-background-light // #F5F5F5 (Light gray)
border-border     // #E0E0E0 (Borders)
```

### Utility Classes (from globals.css)
```tsx
.card              // White card with border and shadow
.btn-primary       // Magenta button
.btn-secondary     // Outlined magenta button
.badge             // Small magenta badge
```

### Spacing
```tsx
p-4    // 16px (cards)
gap-6  // 24px (grid)
my-8   // 32px vertical margin
```

## 💡 Tips for Windsurf

### 1. Always reference the design system first
```
Read docs/design-system/secrets-shop-design-system.md
before implementing any new component
```

### 2. Use existing Tailwind utilities
```tsx
// Don't create new CSS
className="bg-primary text-white px-8 py-3 rounded font-semibold"

// Use utility classes from globals.css
className="btn-primary"
```

### 3. Check what's already done
Look at the system reminders showing modified files to see what Windsurf already changed.

### 4. Test with real Medusa data
```tsx
// ProductGrid already fetches from Medusa
// Use the same pattern for other components
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: () => medusaClient.products.list()
})
```

## 🚀 Workflow

1. **Start with component structure**
   - Copy placeholder
   - Add all HTML elements

2. **Apply Tailwind classes**
   - Use design system colors
   - Follow spacing guidelines

3. **Add interactivity**
   - Hover states
   - Click handlers
   - State management

4. **Connect to Medusa API**
   - Fetch real data
   - Handle loading/error states

5. **Test responsive design**
   - Check mobile view
   - Adjust breakpoints

## 📖 Full Design System Location
`docs/design-system/secrets-shop-design-system.md`

Read this file for complete specifications on:
- Color palette
- Typography
- Component designs
- Spacing system
- Responsive breakpoints
- Animation timings

---

**Remember:** Windsurf can EDIT existing files but cannot CREATE new ones.
If you need a new file, ask Claude Code: `@Claude create <filepath>`
