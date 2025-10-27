// Extended seed script with categories and many products
// Usage: node scripts/seed-products-extended.js

const axios = require('axios');

const MEDUSA_URL = 'https://medusa.glaza.me';
const ADMIN_EMAIL = 'seeder@glaza.me';
const ADMIN_PASSWORD = 'supersecret';

// Categories (Collections in Medusa)
const categories = [
  { title: 'Clothing', handle: 'clothing' },
  { title: 'Electronics', handle: 'electronics' },
  { title: 'Home & Living', handle: 'home-living' },
  { title: 'Beauty & Health', handle: 'beauty-health' },
  { title: 'Sports & Outdoors', handle: 'sports-outdoors' },
  { title: 'Books & Media', handle: 'books-media' },
];

// Extended product list with categories
const products = [
  // Clothing
  { title: 'Classic White T-Shirt', description: 'Premium cotton t-shirt', handle: 'white-tshirt', category: 'clothing', price: 1999, sizes: ['S', 'M', 'L', 'XL'] },
  { title: 'Black Polo Shirt', description: 'Elegant polo shirt', handle: 'black-polo', category: 'clothing', price: 2999, sizes: ['S', 'M', 'L', 'XL'] },
  { title: 'Blue Denim Jeans', description: 'Classic fit jeans', handle: 'denim-jeans', category: 'clothing', price: 4999, sizes: ['28', '30', '32', '34', '36'] },
  { title: 'Slim Fit Chinos', description: 'Comfortable chino pants', handle: 'chinos', category: 'clothing', price: 3999, sizes: ['28', '30', '32', '34', '36'] },
  { title: 'Leather Jacket', description: 'Genuine leather jacket', handle: 'leather-jacket', category: 'clothing', price: 15999, sizes: ['S', 'M', 'L', 'XL'] },
  { title: 'Winter Coat', description: 'Warm winter coat', handle: 'winter-coat', category: 'clothing', price: 12999, sizes: ['S', 'M', 'L', 'XL'] },
  { title: 'Cotton Hoodie', description: 'Comfortable hoodie', handle: 'hoodie', category: 'clothing', price: 4999, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { title: 'Formal Dress Shirt', description: 'Business dress shirt', handle: 'dress-shirt', category: 'clothing', price: 3499, sizes: ['S', 'M', 'L', 'XL'] },
  { title: 'Summer Dress', description: 'Light summer dress', handle: 'summer-dress', category: 'clothing', price: 5999, sizes: ['S', 'M', 'L', 'XL'] },
  { title: 'Yoga Pants', description: 'Stretchable yoga pants', handle: 'yoga-pants', category: 'clothing', price: 3999, sizes: ['S', 'M', 'L', 'XL'] },

  // Electronics
  { title: 'Wireless Headphones', description: 'Bluetooth noise-canceling headphones', handle: 'wireless-headphones', category: 'electronics', price: 9999 },
  { title: 'Smart Watch', description: 'Fitness tracking smart watch', handle: 'smart-watch', category: 'electronics', price: 12999 },
  { title: 'Bluetooth Speaker', description: 'Portable bluetooth speaker', handle: 'bluetooth-speaker', category: 'electronics', price: 6999 },
  { title: 'USB-C Cable', description: 'Fast charging cable', handle: 'usbc-cable', category: 'electronics', price: 999 },
  { title: 'Power Bank', description: '20000mAh power bank', handle: 'power-bank', category: 'electronics', price: 3999 },
  { title: 'Wireless Mouse', description: 'Ergonomic wireless mouse', handle: 'wireless-mouse', category: 'electronics', price: 2999 },
  { title: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', handle: 'mechanical-keyboard', category: 'electronics', price: 8999 },
  { title: 'Webcam HD', description: '1080p HD webcam', handle: 'webcam-hd', category: 'electronics', price: 5999 },
  { title: 'Phone Stand', description: 'Adjustable phone stand', handle: 'phone-stand', category: 'electronics', price: 1499 },
  { title: 'LED Desk Lamp', description: 'Dimmable LED lamp', handle: 'led-lamp', category: 'electronics', price: 3499 },

  // Home & Living
  { title: 'Cotton Bedsheets', description: 'Soft cotton bedsheets set', handle: 'cotton-bedsheets', category: 'home-living', price: 4999 },
  { title: 'Memory Foam Pillow', description: 'Ergonomic memory foam pillow', handle: 'memory-pillow', category: 'home-living', price: 2999 },
  { title: 'Wall Clock', description: 'Modern wall clock', handle: 'wall-clock', category: 'home-living', price: 1999 },
  { title: 'Table Lamp', description: 'Decorative table lamp', handle: 'table-lamp', category: 'home-living', price: 3999 },
  { title: 'Throw Blanket', description: 'Cozy throw blanket', handle: 'throw-blanket', category: 'home-living', price: 2499 },
  { title: 'Area Rug', description: 'Soft area rug 5x7', handle: 'area-rug', category: 'home-living', price: 7999 },
  { title: 'Curtains Set', description: 'Blackout curtains', handle: 'curtains', category: 'home-living', price: 4499 },
  { title: 'Storage Boxes', description: 'Set of 3 storage boxes', handle: 'storage-boxes', category: 'home-living', price: 1999 },

  // Beauty & Health
  { title: 'Face Cream', description: 'Moisturizing face cream', handle: 'face-cream', category: 'beauty-health', price: 2999 },
  { title: 'Shampoo & Conditioner', description: 'Natural hair care set', handle: 'shampoo-set', category: 'beauty-health', price: 1999 },
  { title: 'Essential Oils Set', description: 'Aromatherapy essential oils', handle: 'essential-oils', category: 'beauty-health', price: 3499 },
  { title: 'Facial Cleanser', description: 'Gentle facial cleanser', handle: 'facial-cleanser', category: 'beauty-health', price: 1499 },
  { title: 'Body Lotion', description: 'Hydrating body lotion', handle: 'body-lotion', category: 'beauty-health', price: 1999 },
  { title: 'Nail Care Kit', description: 'Professional nail care kit', handle: 'nail-kit', category: 'beauty-health', price: 2499 },
  { title: 'Hair Dryer', description: 'Professional hair dryer', handle: 'hair-dryer', category: 'beauty-health', price: 5999 },

  // Sports & Outdoors
  { title: 'Yoga Mat', description: 'Non-slip yoga mat', handle: 'yoga-mat', category: 'sports-outdoors', price: 2999 },
  { title: 'Dumbbells Set', description: '5kg dumbbells pair', handle: 'dumbbells', category: 'sports-outdoors', price: 4999 },
  { title: 'Resistance Bands', description: 'Set of 5 resistance bands', handle: 'resistance-bands', category: 'sports-outdoors', price: 1999 },
  { title: 'Running Shoes', description: 'Lightweight running shoes', handle: 'running-shoes', category: 'sports-outdoors', price: 7999, sizes: ['39', '40', '41', '42', '43', '44'] },
  { title: 'Water Bottle', description: '1L insulated water bottle', handle: 'water-bottle', category: 'sports-outdoors', price: 1499 },
  { title: 'Gym Bag', description: 'Spacious gym duffle bag', handle: 'gym-bag', category: 'sports-outdoors', price: 3999 },
  { title: 'Jump Rope', description: 'Speed jump rope', handle: 'jump-rope', category: 'sports-outdoors', price: 999 },
  { title: 'Camping Tent', description: '4-person camping tent', handle: 'camping-tent', category: 'sports-outdoors', price: 12999 },

  // Books & Media
  { title: 'Fiction Novel', description: 'Bestselling fiction book', handle: 'fiction-novel', category: 'books-media', price: 1499 },
  { title: 'Self-Help Book', description: 'Personal development guide', handle: 'selfhelp-book', category: 'books-media', price: 1999 },
  { title: 'Cookbook', description: 'Healthy recipes cookbook', handle: 'cookbook', category: 'books-media', price: 2499 },
  { title: 'Art Print', description: 'Modern art print poster', handle: 'art-print', category: 'books-media', price: 999 },
  { title: 'Notebook Set', description: 'Set of 3 lined notebooks', handle: 'notebooks', category: 'books-media', price: 1299 },
];

async function login() {
  try {
    const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createCollection(collection, authToken) {
  try {
    const response = await axios.post(
      `${MEDUSA_URL}/admin/collections`,
      collection,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ Created collection: ${collection.title}`);
    return response.data.collection;
  } catch (error) {
    console.error(`❌ Failed to create collection ${collection.title}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createProduct(product, collectionId, authToken) {
  try {
    const productData = {
      title: product.title,
      description: product.description,
      handle: product.handle,
      is_giftcard: false,
      discountable: true,
      thumbnail: `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.title)}`,
      collection_id: collectionId,
      status: 'published',
    };

    // Add options and variants if sizes exist
    if (product.sizes) {
      productData.options = [{ title: 'Size' }];
      productData.variants = product.sizes.map(size => ({
        title: size,
        prices: [{ amount: product.price, currency_code: 'rub' }],
        options: [{ value: size }],
        inventory_quantity: 100,
        manage_inventory: true,
      }));
    } else {
      productData.variants = [{
        title: 'Default',
        prices: [{ amount: product.price, currency_code: 'rub' }],
        inventory_quantity: 100,
        manage_inventory: true,
      }];
    }

    const response = await axios.post(
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
    return response.data.product;
  } catch (error) {
    console.error(`  ❌ Failed: ${product.title}`, error.response?.data?.message || error.message);
    return null;
  }
}

async function seedDatabase() {
  console.log('🌱 Starting extended product seeding...\n');
  console.log(`📦 Will create:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products\n`);

  try {
    // Login
    console.log('🔐 Logging in...');
    const authToken = await login();
    console.log('✅ Logged in successfully\n');

    // Create categories/collections
    console.log('📁 Creating categories...');
    const collectionMap = {};

    for (const category of categories) {
      const collection = await createCollection(category, authToken);
      if (collection) {
        collectionMap[category.handle] = collection.id;
      }
    }
    console.log('');

    // Create products by category
    for (const category of categories) {
      const categoryProducts = products.filter(p => p.category === category.handle);
      if (categoryProducts.length > 0) {
        console.log(`📦 Creating ${category.title} products (${categoryProducts.length})...`);

        for (const product of categoryProducts) {
          await createProduct(product, collectionMap[category.handle], authToken);
        }
        console.log('');
      }
    }

    console.log('🎉 Seeding complete!');
    console.log(`\nCreated:`);
    console.log(`  ✅ ${Object.keys(collectionMap).length} categories`);
    console.log(`  ✅ ${products.length} products`);
    console.log('\n👉 Check: https://medusa.glaza.me/app/products');
    console.log('👉 Storefront: http://localhost:8001');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run
seedDatabase();
