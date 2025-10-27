# Scripts

## 🎯 Seed Products - Simple v2 (RECOMMENDED for Medusa v2)

**NEW!** Add 10 products to your Medusa v2 store with proper sales channel linking.

### Usage:

1. **Install dependencies:**
   ```bash
   cd ~/Projects/medusa-dropshipping-poc
   npm install axios
   ```

2. **Credentials already configured:**
   - Email: seeder@glaza.me
   - Password: supersecret
   - Backend: https://medusa.glaza.me

3. **Run the script:**
   ```bash
   node scripts/seed-simple-v2.js
   ```

4. **Verify products:**
   ```bash
   node scripts/check-products.js
   ```

### Features:
- ✅ Medusa v2 compatible (uses `/auth/user/emailpass`)
- ✅ Auto-links to Default Sales Channel
- ✅ Simple product structure without variants
- ✅ Fast and reliable

---

## 📦 Seed Products - Extended Version

⚠️ **Note:** Needs updates for full Medusa v2 compatibility (variant structure)

Add **50+ products** in **6 categories** to your Medusa store.

### Usage:

1. **Install dependencies:**
   ```bash
   cd ~/Projects/medusa-dropshipping-poc
   npm install axios
   ```

2. **Credentials already configured:**
   - Email: seeder@glaza.me
   - Password: supersecret

3. **Run the script:**
   ```bash
   node scripts/seed-products-extended.js
   ```

4. **Wait for completion:**
   - Creates 6 categories
   - Creates 50+ products
   - Takes ~2-3 minutes

5. **Check results:**
   - Admin: https://medusa.glaza.me/app/products
   - Storefront: http://localhost:8001

### What it creates:

#### Categories (6):
- 👕 Clothing (10 products)
- 💻 Electronics (10 products)
- 🏠 Home & Living (8 products)
- 💄 Beauty & Health (7 products)
- 🏃 Sports & Outdoors (8 products)
- 📚 Books & Media (5 products)

#### Products Include:
- T-shirts, jeans, jackets
- Headphones, smart watches, keyboards
- Bedsheets, lamps, rugs
- Face cream, shampoo, essential oils
- Yoga mats, dumbbells, running shoes
- Books, notebooks, art prints

All with:
- Realistic prices (9.99 - 159.99 RUB)
- Multiple variants (sizes where applicable)
- Placeholder images
- Published status

---

## 📦 Seed Products - Basic Version

Add just 4 sample products (for testing).

### Usage:

1. **Edit credentials in `seed-products.js`:**
   ```javascript
   const ADMIN_EMAIL = 'your-admin@email.com';
   const ADMIN_PASSWORD = 'your-password';
   ```

2. **Run:**
   ```bash
   node scripts/seed-products.js
   ```

### What it creates:

- Classic T-Shirt (19.99 RUB)
- Denim Jeans (49.99 RUB)
- Winter Jacket (89.99 RUB)
- Sneakers (69.99 RUB)

Each with multiple size variants.

---

## Alternative: Manual Product Creation

1. Login to admin: https://medusa.glaza.me/app/login
2. Go to Products → Create Product
3. Fill in:
   - Title
   - Description
   - Price (in kopecks: 1000 = 10 RUB)
   - Upload image
   - Add variants if needed
4. Save

---

---

## 🔍 Check Products (NEW)

Verify products are available via Store API.

```bash
node scripts/check-products.js
```

### Manual API Check

```bash
curl -s https://medusa.glaza.me/store/products \
  -H "x-publishable-api-key: pk_6a4ec36774e2b32a9aee2142ddb408847eec7d62cf9850e50588de669a0f35ac"
```

Should return products instead of empty array.

---

## 🔗 Link Products to Sales Channel (NEW)

If products exist but aren't visible in store, link them to sales channel.

```bash
node scripts/link-to-sales-channel.js
```

**Note:** This script may need endpoint updates for Medusa v2. Use `seed-simple-v2.js` which auto-links products.
