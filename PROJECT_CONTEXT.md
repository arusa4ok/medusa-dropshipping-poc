# Medusa Dropshipping POC - Project Context

**Last Updated:** 2025-10-27

## Overview
This is a Proof of Concept (POC) for a dropshipping e-commerce platform built with Medusa.js v2.

## Tech Stack
- **Backend:** Medusa.js v2.11.0 (Node.js e-commerce framework)
- **Frontend Storefront:** Next.js 15.5.6 (React 18.3.1)
- **Local Dev Storefront:** Custom Next.js 15 with Secrets Shop design
- **Database:** PostgreSQL (medusa/medusa123@localhost:5432/medusa)
- **Deployment:** VPS (147.93.157.172)
- **Process Manager:** PM2

## Project Structure

### Backend (`/var/www/medusa-store` on VPS)
```
medusa-store/
├── src/
│   ├── api/              # Custom API endpoints
│   ├── jobs/             # Background jobs
│   ├── modules/          # Custom modules
│   ├── workflows/        # Business logic workflows
│   ├── subscribers/      # Event subscribers
│   └── index.ts          # Entry point
├── static/               # Static assets
├── medusa-config.ts      # Medusa configuration
├── package.json          # Dependencies
└── .env                  # Environment variables (gitignored)
```

### Frontend (`/var/www/medusa-storefront` on VPS)
- Next.js based storefront
- Running on PM2 (ID: 3)

## Key Information

### VPS Details
- **IP:** 147.93.157.172
- **SSH Alias:** devserver
- **User:** root
- **Backend Path:** /var/www/medusa-store
- **Frontend Path:** /var/www/medusa-storefront

### URLs
- **Admin Panel:** https://medusa.glaza.me/app
- **Store API:** https://medusa.glaza.me/store
- **Storefront (VPS):** https://medusa.glaza.me/shop/ru/store
- **Local Dev Storefront:** http://localhost:8001

### Git Repository
- **URL:** https://github.com/arusa4ok/medusa-dropshipping-poc.git
- **Branch:** main
- **Owner:** rusa4ok (rusa4ok@gmail.com)
- **Local Path:** ~/Projects/medusa-dropshipping-poc

### PM2 Processes
- **medusa-backend** (ID: 0) - Backend API server (Port: 9000)
- **medusa-storefront** (ID: 3) - Next.js frontend (Port: 3001)

### Database
- **Host:** localhost (147.93.157.172 for remote)
- **Port:** 5432
- **Database:** medusa
- **User:** medusa
- **Password:** medusa123
- **Region:** Russia (RUB currency)

### API Keys
- **Publishable Key:** pk_6a4ec36774e2b32a9aee2142ddb408847eec7d62cf9850e50588de669a0f35ac
- **Sales Channel ID:** sc_01K85KC1FBRDFK7G15MRJZPBMA (Default Sales Channel)

### Admin Users
- **admin@glaza.me** / admin123 (main admin)
- **seeder@glaza.me** / supersecret (for seeding scripts)
- **test@glaza.me** (test user)

### Medusa CLI
- **Version:** 2.11.0
- **Config:** medusa-config.ts

## Development Workflow

1. **Local Development:**
   - Clone: `git clone https://github.com/arusa4ok/medusa-dropshipping-poc.git`
   - Work locally in `~/Projects/medusa-dropshipping-poc`
   - Commit and push changes to GitHub

2. **Deployment to VPS:**
   - SSH: `ssh devserver`
   - Navigate: `cd /var/www/medusa-store`
   - Pull: `git pull origin main`
   - Install: `npm install` (if dependencies changed)
   - Restart: `pm2 restart medusa-backend`

3. **Monitoring:**
   - Logs: `pm2 logs medusa-backend`
   - Status: `pm2 status`

## Important Files

### Configuration
- `medusa-config.ts` - Main Medusa configuration
- `.env` - Environment variables (NEVER commit)
- `ecosystem.config.js` - PM2 configuration

### Code Structure
- `src/api/` - Custom REST API endpoints
- `src/modules/` - Business logic modules
- `src/workflows/` - Multi-step business processes
- `src/subscribers/` - Event-driven logic

## Current Status (2025-10-27)

### Products in Database
✅ **4 products** successfully seeded:
- Cotton Bedsheets (49.99 RUB)
- Memory Foam Pillow (29.99 RUB)
- Wall Clock (19.99 RUB)
- Table Lamp (39.99 RUB)

All products:
- ✅ Published status
- ✅ Linked to Default Sales Channel
- ✅ Available via Store API
- ✅ Visible in local storefront (http://localhost:8001)

### Collections Created
✅ **6 collections** created (via seed-products-extended.js):
- Clothing
- Electronics
- Home & Living
- Beauty & Health
- Sports & Outdoors
- Books & Media

### Storefront Status
- **Local Dev:** ✅ Running on http://localhost:8001 with products
- **VPS Production:** ⚠️ Running but may need additional configuration for product display

### Scripts Available

#### Seed Products (Medusa v2 Compatible)
```bash
# Simple seeding (10 products, recommended)
node scripts/seed-simple-v2.js

# Check products via API
node scripts/check-products.js

# Extended seeding with categories (48 products, needs v2 fixes)
node scripts/seed-products-extended.js

# Link products to sales channel (if needed)
node scripts/link-to-sales-channel.js
```

## Common Tasks

### Add More Products
1. Edit `scripts/seed-simple-v2.js` with new products
2. Run: `node scripts/seed-simple-v2.js`
3. Verify: `node scripts/check-products.js`

### Add New API Endpoint
1. Create file in `src/api/`
2. Follow Medusa API route conventions
3. Test locally
4. Push to GitHub
5. Deploy to VPS

### Add Custom Module
1. Create folder in `src/modules/`
2. Implement module logic
3. Register in medusa-config.ts
4. Deploy

### Update Dependencies
```bash
npm update
npm install <package>
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

## Design System & Frontend Instructions

**IMPORTANT:** Before building the frontend, read ALL files in `/docs/design-system/`:
1. START-HERE.txt - Main starting point
2. 00-COMPLETE-SUMMARY.txt - Complete overview
3. secrets-shop-design-system.md - Design specifications
4. HOW-TO-USE-GUIDE.md - Implementation guide
5. COMPONENT-EXAMPLES.md - Component templates
6. QUICK-REFERENCE.md - Quick reference
7. FILE-INDEX.md - File structure

See `/docs/AI-INSTRUCTIONS.md` for detailed guidance.

## Resources
- [Medusa Docs](https://docs.medusajs.com)
- [Medusa GitHub](https://github.com/medusajs/medusa)
- [Next.js Docs](https://nextjs.org/docs)
- **Design System:** `/docs/design-system/`

## Notes
- Always test changes locally before deploying
- Check PM2 logs after deployment
- Keep .env file secure and up to date
- Monitor disk space on VPS (currently 88% used)
