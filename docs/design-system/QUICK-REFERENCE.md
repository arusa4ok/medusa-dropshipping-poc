# Design System Quick Reference Cheat Sheet

## 🎨 Colors

### Primary
```
Primary Magenta:    bg-primary / text-primary / border-primary
Dark:               bg-primary-dark
Light:              bg-primary-light
```

### Text
```
Dark Text:          text-text              (#1a1a1a)
Secondary Text:     text-text-secondary    (#666666)
```

### Backgrounds & Borders
```
Light Background:   bg-background          (#F5F5F5)
White:              bg-white
Border:             border-border          (#E0E0E0)
```

### Status
```
Success (Green):    bg-success / text-success       (#7FD856)
Warning (Orange):   bg-warning / text-warning       (#FF9800)
Error (Red):        bg-error / text-error           (#F44336)
Info (Teal):        bg-info / text-info             (#00BCD4)
```

---

## 📏 Spacing & Sizing

### Base Unit: 8px

| Class | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 96px |

### TailwindCSS Usage
```
p-md               padding: 16px all sides
px-lg py-md        padding: 24px horizontal, 16px vertical
m-lg               margin: 24px all sides
gap-4              gap: 16px (use Tailwind's scale)
mx-auto            margin: 0 auto (center)
```

---

## 🔤 Typography

### Heading Sizes
```
h1  text-3xl md:text-4xl  32-48px  bold    H1 (Page Title)
h2  text-2xl md:text-3xl  28-32px  bold    H2 (Section)
h3  text-xl md:text-2xl   22-24px  semibold H3 (Subsection)
h4  text-lg md:text-xl    18-20px  semibold H4 (Card Title)
```

### Body Text
```
text-lg              16px    Body Large
text-base            15px    Body Regular
text-sm              14px    Body Small
text-xs              12px    Caption/Small
```

### Font Weights
```
font-normal          400
font-semibold        600
font-bold            700
font-extrabold       800
```

### Text Colors
```
text-text              Dark gray (#1a1a1a)
text-text-secondary    Medium gray (#666666)
line-through           Strike-through (for old prices)
underline              Underline (for links)
```

---

## 🎛️ Components

### Buttons

**Primary Button**
```html
<button class="bg-primary text-white px-8 py-3 rounded font-semibold hover:bg-primary-dark transition-colors">
  Add to Basket
</button>
```

**Secondary Button**
```html
<button class="border-2 border-primary text-primary px-8 py-3 rounded font-semibold hover:bg-primary-light">
  Learn More
</button>
```

**Button Sizes**
```
Small:   px-5 py-2 text-sm
Medium:  px-8 py-3 text-base      (default)
Large:   px-10 py-4 text-lg
```

---

### Cards

**Product Card Container**
```html
<div class="bg-white border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
  <!-- Content -->
</div>
```

**Padding Options**
```
p-4      16px (mobile)
md:p-6   24px (tablet+)
lg:p-8   32px (desktop+)
```

---

### Badges & Tags

```html
<!-- Discount Badge -->
<div class="bg-primary text-white px-3 py-1 rounded text-xs font-semibold">
  - 34%
</div>

<!-- Status Badge -->
<span class="bg-success text-white px-3 py-1 rounded-full text-xs font-semibold">
  In Stock
</span>
```

---

### Price Display

```html
<!-- Original Price (strikethrough) -->
<p class="text-xs text-text-secondary line-through">£59.95</p>

<!-- Sale Price (magenta, bold) -->
<p class="text-lg md:text-2xl font-bold text-primary">£39.45</p>
```

---

### Star Rating

```html
<div class="flex gap-1">
  <span class="text-yellow-400">★</span>
  <span class="text-yellow-400">★</span>
  <span class="text-yellow-400">★</span>
  <span class="text-yellow-400">★</span>
  <span class="text-yellow-400">★</span>
  <span class="text-xs text-text-secondary ml-2">(7 reviews)</span>
</div>
```

---

## 📱 Responsive Grid

### Product Grid
```html
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  <!-- Product cards go here -->
</div>
```

### Breakpoints
```
Mobile:      < 768px     grid-cols-2
Tablet:      768px+      md:grid-cols-3
Desktop:     1024px+     lg:grid-cols-4
Large:       1440px+     xl:grid-cols-4
```

---

## 🎨 Common Component Patterns

### Input/Search Bar
```html
<input 
  type="text" 
  class="w-full h-10 px-4 border border-border rounded-md focus:outline-none focus:border-primary"
  placeholder="Search products..."
/>
```

### Navigation Header
```html
<header class="bg-white border-b border-border h-16 flex items-center justify-between px-6">
  <!-- Logo -->
  <div>Logo</div>
  <!-- Search -->
  <input class="flex-1 mx-8" type="text" placeholder="Search..."/>
  <!-- Icons -->
  <div class="flex gap-4">Cart | Account</div>
</header>
```

### Filter Sidebar
```html
<aside class="w-64 bg-white border-r border-border p-6">
  <h3 class="text-lg font-semibold mb-4">Filters</h3>
  
  <!-- Category -->
  <div class="mb-6">
    <h4 class="font-semibold text-sm mb-3">Category</h4>
    <label class="flex items-center gap-2 text-sm mb-2">
      <input type="checkbox" class="w-4 h-4"/>
      Vibrators
    </label>
  </div>
</aside>
```

### Product Card (Full)
```html
<div class="bg-white border border-border rounded-lg p-4 hover:shadow-lg">
  <!-- Image -->
  <div class="relative mb-4 bg-gray-100 rounded aspect-square overflow-hidden">
    <img class="w-full h-full object-cover hover:scale-105 transition-transform"/>
    <div class="absolute top-3 right-3 bg-primary text-white px-2 py-1 text-xs font-semibold">
      -34%
    </div>
  </div>
  
  <!-- Brand -->
  <p class="text-xs uppercase text-text-secondary font-semibold mb-2">Brand</p>
  
  <!-- Title -->
  <h3 class="text-sm font-semibold mb-3">Product Title</h3>
  
  <!-- Rating -->
  <div class="flex items-center gap-2 mb-3">
    <div class="flex text-yellow-400">★★★★★</div>
    <span class="text-xs text-text-secondary">(7)</span>
  </div>
  
  <!-- Price -->
  <div class="mb-3">
    <p class="text-xs text-text-secondary line-through">£59.95</p>
    <p class="text-lg font-bold text-primary">£39.45</p>
  </div>
  
  <!-- Button -->
  <button class="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary-dark">
    Add to Basket
  </button>
</div>
```

---

## 🔄 Hover & Interactive States

### Button Hover
```
bg-primary → bg-primary-dark
transition-colors duration-300
```

### Card Hover
```
shadow-sm → shadow-lg
transition-shadow duration-300
```

### Image Hover
```
scale-100 → scale-105
transition-transform duration-300
```

---

## ⚡ Quick Copy-Paste Snippets

### Full Width Button
```html
<button class="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary-dark">
  Click me
</button>
```

### Centered Container
```html
<div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
  <!-- Content -->
</div>
```

### Section with Padding
```html
<section class="py-12 md:py-20 px-4 md:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <!-- Content -->
  </div>
</section>
```

### Two Column Layout
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>Left column</div>
  <div>Right column</div>
</div>
```

### Flex Row with Spacing
```html
<div class="flex justify-between items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 🎯 Accessibility

### Focus States (All Interactive Elements)
```html
<button class="outline-2 outline-offset-2 outline-primary focus:outline">
  Accessible Button
</button>
```

### Image Alt Text
```html
<img src="product.jpg" alt="Satisfyer Pro 2 Pink Clitoral Stimulator"/>
```

### Icon Buttons
```html
<button aria-label="Add to wishlist" class="p-2">
  ♡
</button>
```

---

## 📐 Common Measurements

### Container Widths
```
Max Width: max-w-7xl          (1280px)
Mobile Padding: px-4          (16px)
Tablet Padding: px-6          (24px)
Desktop Padding: px-8         (32px)
```

### Heights
```
Header: h-16                  (64px)
Input: h-10 md:h-12          (40px - 48px)
Button: py-3                  (12px vertical)
```

### Gaps
```
Product Grid: gap-4 md:gap-6  (16px - 24px)
Flex Items: gap-4             (16px)
Sections: gap-8               (32px)
```

---

## ⚙️ TailwindCSS Reminders

### Class Structure
```
state-prefix:property-value

Examples:
hover:bg-primary              (on hover)
focus:border-primary          (on focus)
md:grid-cols-3               (at medium breakpoint)
md:hover:shadow-lg            (at md breakpoint, on hover)
```

### Responsive Breakpoints (Mobile First)
```
No prefix:        < 640px  (mobile)
sm:              640px
md:              768px
lg:              1024px
xl:              1280px
2xl:             1536px
```

### Common Utilities
```
Full width:           w-full
Center horizontally:  mx-auto
Flex center:          flex items-center justify-center
Hidden mobile:        hidden md:block
```

---

## 🚀 Quick Start Template

```html
<!-- Page with Section -->
<main class="bg-background min-h-screen">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
    <!-- Heading -->
    <h1 class="text-3xl md:text-4xl font-bold mb-8">Section Title</h1>
    
    <!-- Grid of Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      <!-- Card repeats here -->
    </div>
  </div>
</main>
```

---

## 💾 File Organization

```
secrets-shop/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   └── types/
│       └── product.ts
├── public/
│   └── images/
├── tailwind.config.ts
└── package.json
```

---

**Print this sheet and keep it next to you while coding!** 🎨✨
