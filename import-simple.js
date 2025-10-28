const axios = require('axios')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'
const IMPORT_DIR = './docs/import'

let adminToken = ''

async function login() {
  try {
    console.log('🔐 Logging in...')
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    adminToken = response.data.token
    console.log('✅ Logged in')
    return response.data.token
  } catch (error) {
    console.error('❌ Login failed:', error.message)
    throw error
  }
}

async function processCSVFile(csvFile) {
  return new Promise((resolve, reject) => {
    const products = []
    
    fs.createReadStream(csvFile)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        if (row['Row type'] === 'product_variant') {
          products.push(row)
        }
      })
      .on('end', () => {
        console.log(`📄 Read ${products.length} products from ${path.basename(csvFile)}`)
        resolve(products)
      })
      .on('error', reject)
  })
}

async function processCSVProducts() {
  const csvFiles = [
    path.join(IMPORT_DIR, 'Lingerie.csv'),
    path.join(IMPORT_DIR, 'Toys.csv')
  ]
  
  let totalProducts = 0
  
  for (const csvFile of csvFiles) {
    if (!fs.existsSync(csvFile)) {
      console.log(`⚠️ ${path.basename(csvFile)} not found`)
      continue
    }
    
    console.log(`\n📊 Processing ${path.basename(csvFile)}...`)
    const products = await processCSVFile(csvFile)
    
    for (const product of products) {
      try {
        // Product data
        const productData = {
          title: product['Product name'],
          handle: product['Product name'].toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: product['Description'] || '',
          status: 'published',
          images: []
        }
        
        // Add images
        for (let i = 1; i <= 10; i++) {
          const imageKey = `Product images${i > 1 ? `_${i}` : ''}`
          if (product[imageKey]) {
            productData.images.push({ url: product[imageKey] })
          }
        }
        
        // Create product
        const productResponse = await axios.post(`${MEDUSA_URL}/admin/products`, productData, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        
        const createdProduct = productResponse.data.product
        
        // Create variant
        const priceAmount = Math.round(parseFloat(product['Price'] || '29.99') * 100)
        const variantData = {
          title: product['SKU name'] || 'Default',
          prices: [{ amount: priceAmount, currency_code: 'gbp' }],
          inventory_quantity: parseInt(product['In stock']) || 10
        }
        
        await axios.post(`${MEDUSA_URL}/admin/products/${createdProduct.id}/variants`, variantData, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        
        totalProducts++
        console.log(`✅ ${product['Product name']}`)
        
      } catch (error) {
        console.error(`❌ Failed: ${product['Product name']} - ${error.response?.data?.message || error.message}`)
      }
    }
  }
  
  return totalProducts
}

async function main() {
  try {
    console.log('🚀 Import from docs/import started...')
    
    await login()
    
    const count = await processCSVProducts()
    
    console.log(`\n🎉 Done! Imported ${count} products`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()
