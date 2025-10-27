// Link products to sales channel
const axios = require('axios');

const MEDUSA_URL = 'https://medusa.glaza.me';
const ADMIN_EMAIL = 'seeder@glaza.me';
const ADMIN_PASSWORD = 'supersecret';

async function login() {
  const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  return response.data.token;
}

async function getProducts(authToken) {
  const response = await axios.get(
    `${MEDUSA_URL}/admin/products`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }
  );
  return response.data.products;
}

async function getSalesChannels(authToken) {
  const response = await axios.get(
    `${MEDUSA_URL}/admin/sales-channels`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }
  );
  return response.data.sales_channels;
}

async function linkProductToSalesChannel(productId, salesChannelId, authToken) {
  try {
    await axios.post(
      `${MEDUSA_URL}/admin/products/${productId}/sales-channels`,
      {
        add: [salesChannelId]
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`  ✅ Linked product ${productId}`);
  } catch (error) {
    console.error(`  ❌ Failed to link ${productId}:`, error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🔗 Linking products to sales channel...\\n');

  const authToken = await login();
  console.log('✅ Logged in\\n');

  const products = await getProducts(authToken);
  const salesChannels = await getSalesChannels(authToken);

  const defaultChannel = salesChannels.find(sc => sc.name === 'Default Sales Channel');

  if (!defaultChannel) {
    console.error('❌ Default Sales Channel not found');
    return;
  }

  console.log(`📦 Linking ${products.length} products to "${defaultChannel.name}"...\\n`);

  for (const product of products) {
    await linkProductToSalesChannel(product.id, defaultChannel.id, authToken);
  }

  console.log('\\n🎉 Done!');
}

main();
