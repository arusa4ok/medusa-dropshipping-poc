# Medusa Dropshipping Storefront

Next.js 15 storefront for the Medusa dropshipping platform, built with the Secrets Shop design system.

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# or
yarn install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://147.93.157.172:9000
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:8001](http://localhost:8001) with your browser.

## Project Structure

```
storefront/
├── app/                    # Next.js 15 App Router
│   ├── (store)/           # Store pages (with layout)
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product pages
│   │   └── categories/    # Category pages
│   ├── (checkout)/        # Checkout flow
│   │   ├── cart/          # Shopping cart
│   │   └── checkout/      # Checkout process
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # React Query provider
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   └── PriceDisplay.tsx
│   ├── products/          # Product-specific components
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── cart/              # Cart components
│   └── layout/            # Layout components
│       ├── NavigationHeader.tsx
│       ├── Footer.tsx
│       └── Hero.tsx
├── lib/
│   └── medusa.ts          # Medusa client configuration
├── types/
│   └── index.ts           # TypeScript types
└── styles/
    └── globals.css        # Tailwind CSS base styles
```

## Design System

This storefront follows the **Secrets Shop Design System** specifications:

- **Colors:**
  - Primary: `#1a1a1a` (Dark)
  - Secondary: `#f5f5f5` (Light Gray)
  - Accent: `#ff6b6b` (Red)

- **Typography:**
  - Sans-serif: Inter
  - Display: Playfair Display

- **Components:**
  - All components follow the design system guidelines
  - See `/docs/design-system/` for detailed specifications

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Medusa.js client integration
- ✅ React Query for data fetching
- ✅ Responsive design
- ✅ Product grid with cards
- ✅ Navigation header
- ✅ Footer
- ✅ Hero section

## Backend Connection

The storefront connects to the Medusa backend at:
- **Production:** http://147.93.157.172:9000
- **Local:** http://localhost:9000 (if running locally)

## Next Steps

1. **Add more pages:**
   - Product detail page
   - Category pages
   - Cart page
   - Checkout flow

2. **Implement cart functionality:**
   - Add to cart
   - Cart management
   - Checkout process

3. **Add filters and search:**
   - Product filtering
   - Search functionality
   - Category navigation

4. **Enhance UI:**
   - Loading states
   - Error boundaries
   - Toast notifications

## Documentation

For detailed design specifications and component examples, see:
- `/docs/design-system/START-HERE.txt`
- `/docs/design-system/secrets-shop-design-system.md`
- `/docs/AI-INSTRUCTIONS.md`

## Deployment

### Build for production

```bash
npm run build
npm run start
```

### Deploy to VPS

```bash
# On VPS:
cd /var/www/medusa-storefront
git pull origin main
npm install
npm run build
pm2 restart medusa-storefront
```
