// Simple seed script for Medusa v2
const axios = require('axios');

const MEDUSA_URL = 'https://medusa.glaza.me';
const ADMIN_EMAIL = 'seeder@glaza.me';
const ADMIN_PASSWORD = 'supersecret';

// Simple products without variants
const products = [
  { title: 'Cotton Bedsheets', description: 'Soft cotton bedsheets set', handle: 'cotton-bedsheets-v2', price: 4999 },
  { title: 'Memory Foam Pillow', description: 'Ergonomic memory foam pillow', handle: 'memory-pillow-v2', price: 2999 },
  { title: 'Wall Clock', description: 'Modern wall clock', handle: 'wall-clock-v2', price: 1999 },
  { title: 'Table Lamp', description: 'Decorative table lamp', handle: 'table-lamp-v2', price: 3999 },
  { title: 'Throw Blanket', description: 'Cozy throw blanket', handle: 'throw-blanket-v2', price: 2499 },
  { title: 'Face Cream', description: 'Moisturizing face cream', handle: 'face-cream-v2', price: 2999 },
  { title: 'Shampoo Set', description: 'Natural hair care set', handle: 'shampoo-set-v2', price: 1999 },
  { title: 'Yoga Mat', description: 'Non-slip yoga mat', handle: 'yoga-mat-v2', price: 2999 },
  { title: 'Dumbbells Set', description: '5kg dumbbells pair', handle: 'dumbbells-v2', price: 4999 },
  { title: 'Fiction Novel', description: 'Bestselling fiction book', handle: 'fiction-novel-v2', price: 1499 },
];

async function login() {
  const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  return response.data.token;
}

async function createProduct(product, authToken) {
  try {
    const productData = {
      title: product.title,
      description: product.description,
      handle: product.handle,
      status: 'published',
      sales_channels: [{
        id: 'sc_01K85KC1FBRDFK7G15MRJZPBMA' // Default Sales Channel
      }],
      options: [{
        title: 'Default Option',
        values: ['Default']
      }],
      variants: [{
        title: 'Default',
        prices: [{
          amount: product.price,
          currency_code: 'rub'
        }],
        options: {
          'Default Option': 'Default'
        }
      }]
    };

    await axios.post(
      `${MEDUSA_URL}/admin/products`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`  ✅ ${product.title} (${product.price / 100} RUB)`);
  } catch (error) {
    console.error(`  ❌ Failed: ${product.title}`, error.response?.data?.message || error.message);
  }
}

async function seed() {
  console.log('🌱 Seeding products...\\n');

  const authToken = await login();
  console.log('✅ Logged in\\n');

  console.log('📦 Creating products...');
  for (const product of products) {
    await createProduct(product, authToken);
  }

  console.log('\\n🎉 Done!');
  console.log('👉 Storefront: http://localhost:8001');
}

seed();
