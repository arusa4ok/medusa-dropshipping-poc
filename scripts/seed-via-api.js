#!/usr/bin/env node

const axios = require('axios');

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@medusa-test.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'supersecret';

const products = [
  { title: 'Cotton Bedsheets', description: 'Soft cotton bedsheets set', handle: 'cotton-bedsheets', price: 4999 },
  { title: 'Memory Foam Pillow', description: 'Ergonomic memory foam pillow', handle: 'memory-pillow', price: 2999 },
  { title: 'Wall Clock', description: 'Modern wall clock', handle: 'wall-clock', price: 1999 },
  { title: 'Table Lamp', description: 'Decorative table lamp', handle: 'table-lamp', price: 3999 },
  { title: 'Throw Blanket', description: 'Cozy throw blanket', handle: 'throw-blanket', price: 2499 },
  { title: 'Face Cream', description: 'Moisturizing face cream', handle: 'face-cream', price: 2999 },
  { title: 'Shampoo Set', description: 'Natural hair care set', handle: 'shampoo-set', price: 1999 },
  { title: 'Yoga Mat', description: 'Non-slip yoga mat', handle: 'yoga-mat', price: 2999 },
  { title: 'Dumbbells Set', description: '5kg dumbbells pair', handle: 'dumbbells', price: 4999 },
  { title: 'Fiction Novel', description: 'Bestselling fiction book', handle: 'fiction-novel', price: 1499 },
];

async function login() {
  console.log('🔐 Logging in...');
  try {
    const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✓ Login successful');
    return response.data.token;
  } catch (error) {
    console.error('✗ Login failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function getRegions(authToken) {
  try {
    const response = await axios.get(`${MEDUSA_URL}/admin/regions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data.regions;
  } catch (error) {
    console.error('Error fetching regions:', error.response?.data || error.message);
    return [];
  }
}

async function createRegion(authToken) {
  console.log('🌍 Creating region...');
  try {
    const response = await axios.post(
      `${MEDUSA_URL}/admin/regions`,
      {
        name: 'Russia',
        currency_code: 'rub',
        countries: ['ru'],
      },
      {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ Region created');
    return response.data.region;
  } catch (error) {
    console.error('✗ Failed to create region:', error.response?.data || error.message);
    throw error;
  }
}

async function createProduct(product, authToken, regionId) {
  try {
    const productData = {
      title: product.title,
      description: product.description,
      handle: product.handle,
      status: 'published',
      is_giftcard: false,
      discountable: true,
      options: [
        {
          title: 'Default Option',
          values: ['Default']
        }
      ],
      variants: [
        {
          title: 'Default',
          manage_inventory: false,
          prices: [
            {
              amount: product.price,
              currency_code: 'rub',
            }
          ],
          options: {
            'Default Option': 'Default'
          }
        }
      ]
    };

    const response = await axios.post(
      `${MEDUSA_URL}/admin/products`,
      productData,
      {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✓ Created: ${product.title}`);
    return response.data.product;
  } catch (error) {
    console.error(`✗ Failed to create ${product.title}:`, error.response?.data || error.message);
    return null;
  }
}

async function getSalesChannels(authToken) {
  try {
    const response = await axios.get(`${MEDUSA_URL}/admin/sales-channels`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data.sales_channels;
  } catch (error) {
    console.error('Error fetching sales channels:', error.response?.data || error.message);
    return [];
  }
}

async function addProductsToSalesChannel(salesChannelId, productIds, authToken) {
  try {
    await axios.post(
      `${MEDUSA_URL}/admin/sales-channels/${salesChannelId}/products`,
      {
        add: productIds
      },
      {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✓ Added ${productIds.length} products to sales channel`);
  } catch (error) {
    console.error('✗ Failed to add products to sales channel:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Starting seed process...\n');
  
  try {
    // Login
    const authToken = await login();
    
    // Get sales channels
    const salesChannels = await getSalesChannels(authToken);
    if (salesChannels.length === 0) {
      console.error('❌ No sales channels found! Please create a sales channel first.');
      process.exit(1);
    }
    const defaultSalesChannel = salesChannels[0];
    console.log(`📢 Using sales channel: ${defaultSalesChannel.name} (${defaultSalesChannel.id})\n`);
    
    // Check/Create region
    let regions = await getRegions(authToken);
    if (regions.length === 0) {
      await createRegion(authToken);
      regions = await getRegions(authToken);
    }
    
    const region = regions[0];
    console.log(`📦 Creating ${products.length} products...\n`);
    
    // Create products
    let successCount = 0;
    const createdProductIds = [];
    for (const product of products) {
      const result = await createProduct(product, authToken, region?.id);
      if (result) {
        successCount++;
        createdProductIds.push(result.id);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Add all products to sales channel
    if (createdProductIds.length > 0) {
      console.log(`\n🔗 Adding products to sales channel...`);
      await addProductsToSalesChannel(defaultSalesChannel.id, createdProductIds, authToken);
    }
    
    console.log(`\n✅ Seed completed! Created ${successCount}/${products.length} products`);
    console.log(`\n🌐 Visit Admin Panel: ${MEDUSA_URL}/app`);
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`🛍️  Storefront: http://localhost:8001/products`);
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
}

main();
