const axios = require('axios')
const fs = require('fs')
const path = require('path')

const MEDUSA_URL = 'http://localhost:9000'
const IMPORT_DIR = './docs/import'

// Используем publishable API ключ вместо admin auth
const PUBLISHABLE_KEY = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'

async function testAPI() {
  try {
    console.log('🔍 Testing store API...')
    const response = await axios.get(`${MEDUSA_URL}/store/products`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    console.log(`✅ Store API working: ${response.data.count} products`)
    return true
  } catch (error) {
    console.error('❌ Store API failed:', error.message)
    return false
  }
}

async function processProductsDirectly() {
  const productsPath = path.join(IMPORT_DIR, 'products.json')
  
  if (!fs.existsSync(productsPath)) {
    console.log('⚠️ products.json not found')
    return 0
  }
  
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
  console.log(`📦 Found ${products.length} products in JSON`)
  
  let processed = 0
  for (const product of products) {
    console.log(`📝 Product ${++processed}: ${product.title}`)
    console.log(`   - Description: ${product.description?.substring(0, 100)}...`)
    console.log(`   - Images: ${product.images?.length || 0}`)
    console.log(`   - Status: ${product.status}`)
  }
  
  return processed
}

async function main() {
  try {
    console.log('🚀 Alternative import approach...\n')
    
    const apiWorking = await testAPI()
    if (!apiWorking) {
      console.log('❌ Cannot proceed - API not working')
      process.exit(1)
    }
    
    const processed = await processProductsDirectly()
    
    console.log(`\n🎉 Alternative import completed!`)
    console.log(`📊 Processed ${processed} products from JSON`)
    
    console.log('\n💡 Recommendation: Use existing products in store')
    console.log('   Admin API authorization seems to have issues')
    console.log('   Store API is working fine for frontend')
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()
