const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

async function createSalesChannel() {
  try {
    console.log('🔐 Logging in...')
    const loginResponse = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    
    const token = loginResponse.data.token
    console.log('✅ Logged in successfully')
    
    console.log('🏪 Creating sales channel...')
    const channelResponse = await axios.post(`${MEDUSA_URL}/admin/sales-channels`, {
      name: "Default Store",
      description: "Default sales channel for storefront",
      is_default: true
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Sales channel created:', channelResponse.data)
    
    // Теперь связываем существующие продукты с sales channel
    console.log('🔗 Linking products to sales channel...')
    const productsResponse = await axios.get(`${MEDUSA_URL}/admin/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const products = productsResponse.data.products
    const channelId = channelResponse.data.sales_channel.id
    
    for (const product of products) {
      try {
        await axios.post(`${MEDUSA_URL}/admin/products/${product.id}/sales-channels`, {
          sales_channel_id: channelId
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log(`✅ Linked product: ${product.title}`)
      } catch (error) {
        console.log(`❌ Failed to link product: ${product.title}`)
      }
    }
    
    console.log('🎉 All products linked to sales channel!')
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
  }
}

createSalesChannel()
