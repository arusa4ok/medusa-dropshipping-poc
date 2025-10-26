# Secrets Shop - Design System Documentation

## 1. Color Palette

### Primary Colors
- **Magenta/Hot Pink**: `#E91E8C` or `#FF1493` - Primary CTA, buttons, accents
- **Dark Navy/Black**: `#1a1a1a` or `#0a0a0a` - Text, headers, dark backgrounds
- **White**: `#FFFFFF` - Primary background, cards

### Secondary Colors
- **Teal/Turquoise**: `#00BCD4` or `#1AB8A6` - Used in badges, highlights
- **Lime Green**: `#7FD856` or `#76D856` - Success states, badges
- **Light Gray**: `#F5F5F5` or `#FAFAFA` - Secondary background
- **Medium Gray**: `#CCCCCC` or `#E0E0E0` - Borders, dividers
- **Dark Gray**: `#666666` or `#757575` - Secondary text

### Status Colors
- **Success**: `#7FD856` (Green)
- **Alert/Warning**: `#FF9800` (Orange)
- **Error**: `#F44336` (Red)
- **Info**: `#00BCD4` (Teal)

## 2. Typography

### Font Family
- **Primary**: `Segoe UI, Tahoma, Geneva, Verdana, sans-serif` (System fonts)
- **Alternative**: Consider `Inter`, `Poppins`, or `Roboto` for web implementation

### Font Sizes & Hierarchy
```
H1 (Hero/Page Title):    32-48px, Weight: 700/800, Line-height: 1.2
H2 (Section Header):     28-32px, Weight: 700, Line-height: 1.3
H3 (Subsection):         22-24px, Weight: 600/700, Line-height: 1.4
H4 (Card Title):         18-20px, Weight: 600, Line-height: 1.4
Body Large:              16px, Weight: 400, Line-height: 1.6
Body Regular:            14-15px, Weight: 400, Line-height: 1.5
Body Small:              12-13px, Weight: 400, Line-height: 1.5
Caption/Micro:           11-12px, Weight: 400, Line-height: 1.4
Button Text:             14-16px, Weight: 600/700
```

### Font Weights
- 400 (Regular)
- 600 (Semi-bold)
- 700 (Bold)
- 800 (Extra-bold)

## 3. Spacing System

### Base Unit: 8px
```
xs:    4px    (0.5 × base)
sm:    8px    (1 × base)
md:   16px    (2 × base)
lg:   24px    (3 × base)
xl:   32px    (4 × base)
2xl:  48px    (6 × base)
3xl:  64px    (8 × base)
4xl:  96px   (12 × base)
```

### Common Spacing Applications
- **Padding in Cards**: 16px or 24px
- **Margin between sections**: 24px to 48px
- **Gap in grids**: 16px or 24px
- **Horizontal padding (page)**: 16px mobile, 24px tablet, 32px desktop

## 4. Component Library

### 4.1 Buttons

#### Primary Button
```
Background: #E91E8C (Magenta)
Text Color: White
Padding: 12px 32px (vertical × horizontal)
Border Radius: 4px or 6px
Font Size: 14-16px
Font Weight: 600/700
Hover: Darker shade (#D1157A)
Active: Even darker (#B80F6B)
Disabled: Gray (#CCCCCC)
Transition: 0.3s ease
```

#### Secondary Button
```
Background: White or Transparent
Border: 2px solid #E91E8C
Text Color: #E91E8C
Padding: 12px 32px
Border Radius: 4px
Hover: Light magenta background (#FFF0F7)
```

#### Button Sizes
- **Small**: 10px 20px, 12px font
- **Medium**: 12px 32px, 14px font (default)
- **Large**: 14px 40px, 16px font

### 4.2 Cards

#### Product Card
```
Background: White
Border: 1px solid #E0E0E0
Border Radius: 8px
Padding: 16px
Box Shadow: 0 2px 8px rgba(0,0,0,0.1) on hover
Transition: 0.3s ease

Layout:
- Image container (aspect ratio 1:1 or 4:5)
- Brand/Category label (12px, uppercase)
- Product title (16px, 600 weight)
- Rating (stars + count)
- Price section:
  - Original price: strikethrough, gray
  - Sale price: magenta, bold, larger
  - Discount badge: "- 34%" in magenta background
- "Add to Basket" button (full width)
- Wishlist/Compare icons (top right)
```

#### Category Card
```
Minimal design
Image background with overlay
Title positioned at bottom
Hover: Slight zoom, darkened overlay
```

### 4.3 Navigation

#### Header/Navigation Bar
```
Height: 60-70px
Background: White
Border-bottom: 1px solid #E0E0E0
Display: Flex, space-between

Elements:
- Logo (left)
- Search bar (center) - width: 40% max
- Cart, Account icons (right)
- Secondary nav below: Categories, Brands, etc.
```

#### Search Bar
```
Height: 40px
Border: 1px solid #E0E0E0
Border Radius: 4px
Padding: 8px 16px
Placeholder color: #999
Focus: Border color changes to #E91E8C
Icon: Magnifying glass, gray
```

### 4.4 Forms & Inputs

#### Text Input
```
Height: 40-44px
Padding: 8px 12px
Border: 1px solid #E0E0E0
Border Radius: 4px
Font Size: 14px
Focus: Border #E91E8C, outline: none
Placeholder: #999
Disabled: Background #F5F5F5
```

#### Checkbox/Radio
```
Size: 18-20px
Color (checked): #E91E8C
Border: 1px solid #CCC
Border Radius: 2px (checkbox) or 50% (radio)
```

#### Select Dropdown
```
Same as text input
Arrow icon (right side)
```

### 4.5 Price Display

```
Original Price:
- Font Size: 12-14px
- Color: #999 or #CCC
- Text Decoration: line-through
- Weight: 400

Sale Price:
- Font Size: 18-24px
- Color: #E91E8C
- Weight: 700

Discount Badge:
- Background: #E91E8C
- Color: White
- Padding: 4px 8px
- Border Radius: 2px
- Font Size: 12px
- Weight: 600
- Text: "- 34%" or "HIT"
```

### 4.6 Rating & Reviews

```
Stars: 5-point system, gold/amber color (#FFB800 or #FFC107)
Rating Text: 14px, #999
Review Count: 12px, gray

Star Size Options:
- Small: 14px
- Medium: 18px
- Large: 24px
```

### 4.7 Badges & Tags

```
Background: #E91E8C or #00BCD4 or #7FD856
Color: White
Padding: 4px 12px
Border Radius: 12px or 4px
Font Size: 11-12px
Font Weight: 600
```

### 4.8 Layout Grid

#### Desktop (1200px+)
- 4 columns for product grids
- 3-column sidebar: Filters (left 25%), Products (center 75%)

#### Tablet (768px - 1199px)
- 3 columns for products
- 2-column layout with collapsible filters

#### Mobile (< 768px)
- 2 columns for products
- Full-width filters with accordion
- Sticky header with search and filters
- Bottom sticky cart button

## 5. Pattern Library

### 5.1 Product Grid
```
- Gap: 16px or 24px
- Cards per row: 4 (desktop), 3 (tablet), 2 (mobile)
- Card aspect ratio: 1:1 for images, or 4:5
- Pagination or infinite scroll
```

### 5.2 Filter Sidebar
```
Width: 250px (desktop), full-width collapsible (mobile)
Sections:
- Filter by Category (with checkboxes)
- Price Range (slider)
- Brand (scrollable list)
- Features (checkboxes)
- Size (radio buttons or grid)
- Color (color swatches)
- Material (list)
- Waterproof status

Clear Filters button at top
```

### 5.3 Promotion Banner
```
Background: Orange or contrasting color (#FF9800 or custom)
Text: White, bold, centered
Padding: 16px
Font Size: 16-18px
Example: "SEXY HALLOWEEN - SPOOKY SAVINGS UP TO 50%"
Possibly with CTA button
```

### 5.4 Product Details Page Layout
```
Left (60%):
- Large product image (main) with thumbnails below
- Zoom/gallery functionality

Right (40%):
- Breadcrumb navigation
- Product title (32px, bold)
- Rating and reviews count
- Brand/SKU
- Price section (original + sale)
- Stock status
- Key features (bullet list)
- Add to Basket button (full width, magenta)
- Quantity selector
- Wishlist/Share icons
- Bundle section below
- Frequently bought together section
- Customer reviews section
```

### 5.5 Footer
```
Background: #F5F5F5 or #1a1a1a (dark option)
Padding: 48px 32px 24px
Column layout: 4-5 columns
Links: 12-14px, gray text
Headings: Bold, darker gray

Sections:
1. Customer Service (Help, Delivery, Returns)
2. Company (About, Contact, Blog)
3. Popular Categories
4. Legal (Terms, Privacy, Sitemap)
5. Contact Info & Payment methods

Social icons at bottom
```

## 6. Interactive Elements

### 6.1 Hover States
```
Product Cards: 
- Box shadow increases
- Image slightly zooms (scale 1.05)
- Button becomes highlighted

Buttons:
- Background darkens
- Cursor changes to pointer
- Text remains same color

Links:
- Underline appears or color changes to magenta
```

### 6.2 Loading States
```
Skeleton screens for product cards
Spinner animation (centered, magenta color)
Progress indicator for multi-step forms
```

### 6.3 Toast Notifications
```
Position: Bottom-right or top-center
Background: Green (success), Red (error), Blue (info)
Text: White, 14px
Padding: 12px 16px
Border Radius: 4px
Auto-dismiss: 3-5 seconds
Animation: Slide in/out
```

## 7. Accessibility

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+ bold): Minimum 3:1 ratio

### Focus States
```
Outline: 2px solid #E91E8C
Outline-offset: 2px
On all interactive elements
```

### ARIA Labels
- Images: Alt text
- Buttons: aria-label if no visible text
- Forms: Associated labels
- Icon-only buttons: aria-label required

## 8. Responsive Design

### Breakpoints
```
Mobile:    0px - 479px
Tablet:    480px - 1023px
Desktop:   1024px+
Desktop L: 1440px+
```

### Mobile-Specific
- Touch targets: Minimum 44px × 44px
- Hamburger menu for navigation
- Single column product grid
- Full-width buttons
- Sticky header with search and cart
- Bottom navigation or sticky cart button

## 9. Animation & Transitions

### Standard Transitions
```
Duration: 0.2s - 0.3s
Easing: ease-in-out or cubic-bezier(0.4, 0, 0.2, 1)
Common properties: background-color, border-color, box-shadow, transform
```

### Page Transitions
```
Fade in: opacity 0 to 1, 0.3s
Slide in: transform translateX/Y, 0.3s
```

## 10. Dark Mode (Optional)

### Dark Palette
- Background: `#1a1a1a`
- Card background: `#2a2a2a`
- Text: `#F5F5F5`
- Borders: `#404040`
- Primary accent: `#E91E8C` (same)

## 11. TailwindCSS Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': '#E91E8C',
        'primary-dark': '#D1157A',
        'primary-light': '#FFF0F7',
        'text': '#1a1a1a',
        'text-secondary': '#666666',
        'border': '#E0E0E0',
        'background': '#F5F5F5',
        'success': '#7FD856',
        'warning': '#FF9800',
        'error': '#F44336',
        'info': '#00BCD4',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.4' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.5' }],
        'lg': ['16px', { lineHeight: '1.6' }],
        'xl': ['18px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'full': '9999px',
      },
    },
  },
};
```

## 12. Component Examples for Next.js

### ProductCard Component
```
Props:
- id: string
- image: string
- brand: string
- title: string
- rating: number (0-5)
- reviewCount: number
- originalPrice: number
- salePrice: number
- discount: number (%)
- inStock: boolean
- onAddToCart: function
- onWishlist: function
```

### PriceDisplay Component
```
Props:
- originalPrice: number
- salePrice: number
- showDiscount: boolean
- discountPercentage: number
```

### FilterSidebar Component
```
Props:
- categories: array
- brands: array
- priceRange: { min, max }
- selectedFilters: object
- onFilterChange: function
```

## 13. Imagery Guidelines

### Product Images
- Format: JPG or WebP
- Dimensions: Square (1:1) preferred for grids
- File size: Optimized for web (< 200KB)
- Multiple angles for detail pages
- White or neutral background

### Category Images
- Format: JPG or WebP
- Aspect ratio: 1:1 or 4:3
- With overlay for text legibility
- Consistent style/photography

### Icons
- Style: Outline or solid
- Size: 20px, 24px, 32px variants
- Color: Match text or primary accent
- Format: SVG preferred

---

This design system provides a solid foundation for rebuilding Secrets Shop using Next.js and TailwindCSS while maintaining visual and functional consistency.
