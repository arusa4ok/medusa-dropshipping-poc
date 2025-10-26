# How to Get Medusa Publishable API Key

## Option 1: From Medusa Admin Dashboard (Recommended)

1. **Open Medusa Admin:**
   https://medusa.glaza.me/app/login

2. **Login** with your admin credentials

3. **Go to Settings:**
   - Click on ⚙️ Settings in the sidebar
   - Navigate to **"Publishable API Keys"** or **"API Key Management"**

4. **Create New Key:**
   - Click "Create API Key" or "Add New"
   - Give it a name (e.g., "Storefront Production")
   - Select sales channels (usually "Default Sales Channel")
   - Click "Create"

5. **Copy the Key:**
   - It will look like: `pk_01234567890abcdef...`
   - Copy the entire key

6. **Add to .env.local:**
   ```bash
   cd ~/Projects/medusa-dropshipping-poc/storefront
   nano .env.local
   ```

   Replace `pk_YOUR_KEY_HERE` with your actual key:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01234567890abcdef...
   ```

7. **Restart dev server:**
   The server should restart automatically, or press `Ctrl+C` and run `npm run dev` again

---

## Option 2: Using Medusa CLI (if you have server access)

SSH into your VPS:
```bash
ssh devserver
cd /var/www/medusa-store
```

Create a publishable API key:
```bash
npx medusa user -e admin@example.com -p your_password
# Then login to admin and create key
```

---

## Option 3: Via API (if you have admin token)

```bash
curl -X POST https://medusa.glaza.me/admin/publishable-api-keys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Storefront Key"
  }'
```

---

## Testing the API Key

After adding the key, test the connection:

```bash
cd ~/Projects/medusa-dropshipping-poc/storefront
npm run dev
```

Open http://localhost:8001 and check if products load.

You should see products instead of the error:
```
Publishable API key required in the request header
```

---

## Troubleshooting

### Error: "Invalid API key"
- Make sure you copied the entire key including the `pk_` prefix
- Check for extra spaces or line breaks
- Make sure the key is for the correct sales channel

### Error: "API key not found"
- The key might have been deleted
- Create a new one in Medusa Admin

### Products still not loading
- Check browser console (F12) for errors
- Verify backend URL is correct: https://medusa.glaza.me
- Make sure dev server restarted after .env.local change

---

## Current Configuration

**Backend URL:** https://medusa.glaza.me
**Storefront URL:** http://localhost:8001
**API Key Status:** ⚠️ Needs to be added to `.env.local`

Once you add the key, your storefront will connect to Medusa and display products!
