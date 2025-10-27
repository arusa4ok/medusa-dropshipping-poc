#!/usr/bin/env node

const axios = require('axios');

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@medusa-test.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'supersecret';

async function login() {
  console.log('🔐 Logging in...');
  try {
    const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✓ Login successful\n');
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getSalesChannels(authToken) {
  const response = await axios.get(`${MEDUSA_URL}/admin/sales-channels`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  return response.data.sales_channels;
}

async function getProducts(authToken) {
  const response = await axios.get(`${MEDUSA_URL}/admin/products?limit=100`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  return response.data.products;
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
    return true;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Linking products to sales channel...\n');
  
  try {
    const authToken = await login();
    
    // Get sales channels
    const salesChannels = await getSalesChannels(authToken);
    if (salesChannels.length === 0) {
      console.error('❌ No sales channels found!');
      process.exit(1);
    }
    
    const defaultSalesChannel = salesChannels[0];
    console.log(`📢 Sales Channel: ${defaultSalesChannel.name}`);
    console.log(`   ID: ${defaultSalesChannel.id}\n`);
    
    // Get all products
    const products = await getProducts(authToken);
    console.log(`📦 Found ${products.length} products\n`);
    
    if (products.length === 0) {
      console.log('No products to link.');
      return;
    }
    
    // Get product IDs
    const productIds = products.map(p => p.id);
    
    console.log('🔗 Linking products to sales channel...');
    const success = await addProductsToSalesChannel(
      defaultSalesChannel.id,
      productIds,
      authToken
    );
    
    if (success) {
      console.log(`\n✅ Successfully linked ${products.length} products to sales channel!`);
      console.log(`\n🛍️  Products should now be visible at:`);
      console.log(`   http://localhost:8001/products`);
    } else {
      console.log('\n❌ Failed to link products');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

main();
