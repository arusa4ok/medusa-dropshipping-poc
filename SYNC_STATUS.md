# Project Synchronization Status

**Last Updated:** 2025-10-27 14:00

## Git Status

### Local Repository (~/Projects/medusa-dropshipping-poc)
**Branch:** main
**Status:** ⚠️ Has uncommitted changes

#### Staged Changes:
- `storefront/tailwind.config.ts` - Updated with luxury theme colors

#### Modified Files (not staged):
- `.cursorrules` - Updated rules
- `package-lock.json` - Dependencies updated (axios added)
- `package.json` - Dependencies updated (axios added)
- `scripts/seed-products-extended.js` - Updated auth endpoint and credentials
- `storefront/app/(store)/page.tsx` - Modified
- `storefront/components/layout/NavigationHeader.tsx` - Added luxury styling
- `storefront/tailwind.config.ts` - Further modifications

#### New Files (untracked):
- `scripts/check-products.js` ✨ NEW - Check products via API
- `scripts/link-to-sales-channel.js` ✨ NEW - Link products to sales channel
- `scripts/seed-simple-v2.js` ✨ NEW - Medusa v2 compatible seeding (RECOMMENDED)

### VPS Backend (/var/www/medusa-store)
**Branch:** main
**Status:** ✅ Clean - No uncommitted changes
**Last Sync:** Up to date with origin/main

### VPS Storefront (/var/www/medusa-storefront)
**Branch:** main
**Status:** ⚠️ Has local modifications
- `next-env.d.ts` - Modified
- `next.config.js` - Modified
- `yarn.lock` - Modified
- `ecosystem.config.js` - Untracked (PM2 config)
- `package-lock.json` - Untracked
- `.env.local` - Modified (publishable key updated)

**Note:** VPS storefront is separate repo, not synced with main project

## MCP Configuration

### Windsurf Integration (/.windsurf/mcp.json)
✅ **Configured** with 3 MCP servers:

1. **filesystem** - Full project access
   - Path: `/Users/rusakovanton/Projects/medusa-dropshipping-poc`

2. **design-system** - Documentation access
   - Path: `/Users/rusakovanton/Projects/medusa-dropshipping-poc/docs`

3. **medusa-docs** - Medusa documentation fetch
   - Allowed domains: docs.medusajs.com, medusajs.com

## What Needs to be Synced

### To Git (Local → GitHub)

Priority files to commit and push:

1. **Scripts (HIGH PRIORITY)**
   ```bash
   git add scripts/seed-simple-v2.js
   git add scripts/check-products.js
   git add scripts/link-to-sales-channel.js
   git add scripts/seed-products-extended.js
   ```

2. **Configuration**
   ```bash
   git add package.json package-lock.json
   git add .cursorrules
   ```

3. **Storefront Updates**
   ```bash
   git add storefront/tailwind.config.ts
   git add storefront/components/layout/NavigationHeader.tsx
   git add storefront/app/(store)/page.tsx
   ```

4. **Documentation**
   ```bash
   git add PROJECT_CONTEXT.md
   git add SYNC_STATUS.md
   ```

### Recommended Commit Message:
```
feat: Add Medusa v2 product seeding and update storefront

- Add seed-simple-v2.js for Medusa v2 compatible product seeding
- Add check-products.js to verify products via Store API
- Add link-to-sales-channel.js for product-channel linking
- Update seed-products-extended.js with v2 auth endpoints
- Update tailwind.config with luxury theme colors
- Enhance NavigationHeader with luxury styling
- Update PROJECT_CONTEXT with current status
- Add axios dependency for seeding scripts

✅ 4 products seeded and working
✅ Local storefront running with products
```

### To VPS (GitHub → VPS Backend)

After pushing to GitHub:

```bash
ssh devserver
cd /var/www/medusa-store
git pull origin main
npm install  # if package.json changed
pm2 restart medusa-backend
```

### VPS Storefront

**Note:** VPS storefront at `/var/www/medusa-storefront` is a separate Medusa Next.js starter template.
- It's NOT synced with our custom storefront at `~/Projects/medusa-dropshipping-poc/storefront`
- Local changes (`.env.local`, publishable key) should stay on VPS
- Don't commit these to any repo

## Development Servers Running

### Local:
- ✅ Custom Storefront: http://localhost:8001 (Bash ID: 60bb8e)
- ⚠️ Multiple duplicate dev servers running (should clean up)

### VPS:
- ✅ Backend: https://medusa.glaza.me (PM2 ID: 0)
- ✅ Storefront: https://medusa.glaza.me/shop/ru/store (PM2 ID: 3)

## Action Items

1. ⬜ Commit and push local changes to GitHub
2. ⬜ Pull updates on VPS backend
3. ⬜ Clean up duplicate local dev servers
4. ⬜ Test products display on VPS storefront
5. ⬜ Consider replacing VPS storefront with custom build

## Quick Commands

```bash
# Check current sync status
cd ~/Projects/medusa-dropshipping-poc && git status

# View what changed
git diff

# Add all new scripts and configs
git add scripts/*.js package*.json PROJECT_CONTEXT.md SYNC_STATUS.md

# Commit
git commit -m "feat: Add Medusa v2 seeding and update docs"

# Push to GitHub
git push origin main

# Sync to VPS
ssh devserver "cd /var/www/medusa-store && git pull origin main"
```
