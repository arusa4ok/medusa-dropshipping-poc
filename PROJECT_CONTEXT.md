# Medusa Dropshipping POC - Project Context

## Overview
This is a Proof of Concept (POC) for a dropshipping e-commerce platform built with Medusa.js.

## Tech Stack
- **Backend:** Medusa.js (Node.js e-commerce framework)
- **Frontend:** Next.js (Storefront)
- **Database:** PostgreSQL
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

### Git Repository
- **URL:** https://github.com/arusa4ok/medusa-dropshipping-poc.git
- **Branch:** main
- **Owner:** rusa4ok (rusa4ok@gmail.com)

### PM2 Processes
- **medusa-backend** (ID: 0) - Backend API server
- **medusa-storefront** (ID: 3) - Next.js frontend

### Medusa CLI
- **Version:** 1.3.23
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

## Common Tasks

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
