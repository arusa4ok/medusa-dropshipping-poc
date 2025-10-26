# Build Frontend Prompt for Windsurf

## Context
You are building a Next.js storefront for a Medusa.js dropshipping e-commerce platform.

## Step 1: Read Documentation
Read ALL files in `/docs/design-system/` folder in this order:
1. START-HERE.txt
2. 00-COMPLETE-SUMMARY.txt
3. HOW-TO-USE-GUIDE.md
4. secrets-shop-design-system.md
5. COMPONENT-EXAMPLES.md
6. QUICK-REFERENCE.md
7. FILE-INDEX.md

## Step 2: Understand Backend
The Medusa backend is already set up at:
- **Local:** /var/www/medusa-store (VPS)
- **API Endpoint:** [To be configured]
- **Config:** medusa-config.ts

## Step 3: Create Frontend Structure
Create a Next.js 14+ storefront with:
```
storefront/
├── app/
│   ├── (store)/          # Store pages
│   ├── (checkout)/       # Checkout flow
│   └── layout.tsx
├── components/
│   ├── ui/               # UI components (from design system)
│   ├── products/         # Product components
│   └── cart/             # Cart components
├── lib/
│   └── medusa.ts         # Medusa client
├── styles/
│   └── globals.css
└── package.json
```

## Step 4: Implement Components
Follow component examples from design system documentation exactly.

## Step 5: Connect to Backend
Use @medusajs/medusa-js to connect to the backend API.

## Questions to Ask Before Starting:
1. Where should the storefront be located? (separate folder or monorepo?)
2. What styling framework should be used? (check design system docs)
3. What are the priority pages to build first?

## Important Reminders:
- Read ALL design system docs before writing ANY code
- Follow the design system specifications exactly
- Ask for clarification if design system conflicts with Medusa best practices
- Test with real backend data
