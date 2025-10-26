// Seed products to Medusa
// Usage: node scripts/seed-products.js

const axios = require('axios');

const MEDUSA_URL = 'https://medusa.glaza.me';
const ADMIN_EMAIL = 'admin@medusa-test.com'; // Change this
const ADMIN_PASSWORD = 'supersecret'; // Change this

const sampleProducts = [
  {
    title: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
    handle: 'classic-tshirt',
    is_giftcard: false,
    discountable: true,
    thumbnail: 'https://via.placeholder.com/300',
    options: [{ title: 'Size' }],
    variants: [
      { title: 'Small', prices: [{ amount: 1999, currency_code: 'rub' }], options: [{ value: 'Small' }] },
      { title: 'Medium', prices: [{ amount: 1999, currency_code: 'rub' }], options: [{ value: 'Medium' }] },
      { title: 'Large', prices: [{ amount: 1999, currency_code: 'rub' }], options: [{ value: 'Large' }] },
    ],
  },
  {
    title: 'Denim Jeans',
    description: 'Classic blue denim jeans with a modern fit',
    handle: 'denim-jeans',
    is_giftcard: false,
    discountable: true,
    thumbnail: 'https://via.placeholder.com/300',
    options: [{ title: 'Size' }],
    variants: [
      { title: '30', prices: [{ amount: 4999, currency_code: 'rub' }], options: [{ value: '30' }] },
      { title: '32', prices: [{ amount: 4999, currency_code: 'rub' }], options: [{ value: '32' }] },
      { title: '34', prices: [{ amount: 4999, currency_code: 'rub' }], options: [{ value: '34' }] },
    ],
  },
  {
    title: 'Winter Jacket',
    description: 'Warm winter jacket for cold weather',
    handle: 'winter-jacket',
    is_giftcard: false,
    discountable: true,
    thumbnail: 'https://via.placeholder.com/300',
    options: [{ title: 'Size' }],
    variants: [
      { title: 'S', prices: [{ amount: 8999, currency_code: 'rub' }], options: [{ value: 'S' }] },
      { title: 'M', prices: [{ amount: 8999, currency_code: 'rub' }], options: [{ value: 'M' }] },
      { title: 'L', prices: [{ amount: 8999, currency_code: 'rub' }], options: [{ value: 'L' }] },
    ],
  },
  {
    title: 'Sneakers',
    description: 'Comfortable and stylish sneakers',
    handle: 'sneakers',
    is_giftcard: false,
    discountable: true,
    thumbnail: 'https://via.placeholder.com/300',
    options: [{ title: 'Size' }],
    variants: [
      { title: '39', prices: [{ amount: 6999, currency_code: 'rub' }], options: [{ value: '39' }] },
      { title: '40', prices: [{ amount: 6999, currency_code: 'rub' }], options: [{ value: '40' }] },
      { title: '41', prices: [{ amount: 6999, currency_code: 'rub' }], options: [{ value: '41' }] },
    ],
  },
];

async function login() {
  try {
    const response = await axios.post(`${MEDUSA_URL}/admin/auth`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    return response.data.user.session;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createProduct(product, authToken) {
  try {
    const response = await axios.post(
      `${MEDUSA_URL}/admin/products`,
      product,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ Created: ${product.title}`);
    return response.data.product;
  } catch (error) {
    console.error(`❌ Failed to create ${product.title}:`, error.response?.data || error.message);
  }
}

async function seedProducts() {
  console.log('🌱 Starting to seed products...\n');

  try {
    // Login
    console.log('🔐 Logging in...');
    const authToken = await login();
    console.log('✅ Logged in successfully\n');

    // Create products
    console.log('📦 Creating products...');
    for (const product of sampleProducts) {
      await createProduct(product, authToken);
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`Created ${sampleProducts.length} products.`);
    console.log('\n👉 Check: https://medusa.glaza.me/app/products');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run
seedProducts();
