const axios = require('axios')

async function testAdminAuth() {
  console.log('🧪 Testing Admin API Authentication...')
  
  try {
    // Step 1: Get JWT token
    const authResponse = await axios.post('http://localhost:9000/auth/admin/emailpass', {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    })
    
    const jwtToken = authResponse.data.token
    console.log('✅ JWT token obtained')
    
    // Step 2: Test admin API with JWT token
    const adminResponse = await axios.get('http://localhost:9000/admin/suppliers-test', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    })
    
    console.log('✅ Admin API works with JWT token!')
    console.log('Response:', adminResponse.data)
    
    // Step 3: Test with suppliers-test POST endpoint
    const testResponse = await axios.post('http://localhost:9000/admin/suppliers-test', {
      product_id: 'pink-silicone-vibrator',
      quantity: 2
    }, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Suppliers selection works!')
    console.log('Selected supplier:', testResponse.data.selected_supplier.name)
    
  } catch (error) {
    console.error('❌ Admin auth test failed:', error.response?.data || error.message)
  }
}

testAdminAuth()
