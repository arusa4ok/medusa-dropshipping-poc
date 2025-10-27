const axios = require('axios');

async function checkProducts() {
  try {
    const response = await axios.get('https://medusa.glaza.me/store/products', {
      headers: {
        'x-publishable-api-key': 'pk_6a4ec36774e2b32a9aee2142ddb408847eec7d62cf9850e50588de669a0f35ac'
      },
      params: {
        limit: 50
      }
    });

    console.log(`Found ${response.data.products.length} products:`);
    response.data.products.forEach(p => {
      console.log(`- ${p.title} (${p.handle})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProducts();
