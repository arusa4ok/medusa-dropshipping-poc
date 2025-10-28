const axios = require('axios')

async function debugImport() {
  const MEDUSA_URL = 'http://localhost:9000'
  const SECRET_API_KEY = "sk_9a0028c107c727e05a5eb2b03f46ec31b031f1319822edeac5fe624769a75d03"
  
  console.log('🔍 Debug Import with API Key...')
  
  try {
    // Test API key authentication
    console.log('🔐 Testing API key authentication...')
    
    const testResponse = await axios.get(`${MEDUSA_URL}/admin/products`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Authentication successful!')
    console.log(`📦 Current products: ${testResponse.data.count}`)
    
    // Test category creation
    console.log('\n📁 Testing category creation...')
    
    const testCategory = {
      name: "Test Category",
      handle: "test-category",
      description: "Test category for debugging",
      metadata: { debug: true }
    }
    
    try {
      const categoryResponse = await axios.post(`${MEDUSA_URL}/admin/product-categories`, testCategory, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('✅ Category created successfully!')
      console.log('Category data:', JSON.stringify(categoryResponse.data.product_category, null, 2))
      
    } catch (error) {
      console.error('❌ Category creation failed:')
      console.error('Status:', error.response?.status)
      console.error('Response:', error.response?.data)
    }
    
    // Test simple product creation
    console.log('\n📦 Testing simple product creation...')
    
    const testProduct = {
      title: "Test Product",
      handle: "test-product-debug",
      description: "Test product for debugging",
      status: "published",
      tags: [{ value: "Test" }],
      options: [{ title: "Size", values: ["One Size"] }],
      variants: [{
        title: "One Size",
        sku: "TEST_001",
        prices: [{ currency_code: "usd", amount: 999 }],
        inventory_quantity: 1,
        manage_inventory: true
      }]
    }
    
    try {
      const productResponse = await axios.post(`${MEDUSA_URL}/admin/products`, testProduct, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('✅ Product created successfully!')
      console.log('Product data:', JSON.stringify(productResponse.data.product, null, 2))
      
    } catch (error) {
      console.error('❌ Product creation failed:')
      console.error('Status:', error.response?.status)
      console.error('Response:', error.response?.data)
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:')
    console.error('Status:', error.response?.status)
    console.error('Response:', error.response?.data)
  }
}

debugImport()
