# Scripts

## Seed Products

Add sample products to your Medusa store.

### Usage:

1. **Install dependencies:**
   ```bash
   npm install axios
   ```

2. **Edit credentials in `seed-products.js`:**
   ```javascript
   const ADMIN_EMAIL = 'your-admin@email.com';
   const ADMIN_PASSWORD = 'your-password';
   ```

3. **Run the script:**
   ```bash
   node scripts/seed-products.js
   ```

4. **Check the admin panel:**
   https://medusa.glaza.me/app/products

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

## Check Products API

```bash
curl -s https://medusa.glaza.me/store/products \
  -H "x-publishable-api-key: pk_6a4ec36774e2b32a9aee2142ddb408847eec7d62cf9850e50588de669a0f35ac"
```

Should return products instead of empty array.
