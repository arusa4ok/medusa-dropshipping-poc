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
    console.log('🔐 Logging in to Medusa admin...')
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    adminToken = response.data.token
    console.log('✅ Successfully logged in')
    return response.data.token
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
    throw error
  }
}

async function createSalesChannel() {
  try {
    console.log('🏪 Creating sales channel...')
    const response = await axios.post(`${MEDUSA_URL}/admin/sales-channels`, {
      name: "Default Store",
      description: "Default sales channel for storefront",
      is_default: true
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
    console.log('✅ Sales channel created')
    return response.data.sales_channel.id
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️ Sales channel already exists, getting existing one...')
      const channels = await axios.get(`${MEDUSA_URL}/admin/sales-channels`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      return channels.data.sales_channels[0]?.id
    }
    throw error
  }
}

async function processCollections() {
  const collectionsPath = path.join(IMPORT_DIR, 'collections.json')
  if (!fs.existsSync(collectionsPath)) {
    console.log('⚠️ collections.json not found, skipping...')
    return
  }

  const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'))
  
  console.log(`📁 Processing ${collections.length} collections...`)
  
  for (const collection of collections) {
    try {
      const response = await axios.post(`${MEDUSA_URL}/admin/collections`, {
        title: collection.title,
        handle: collection.handle,
        metadata: collection.metadata || {}
      }, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      console.log(`✅ Created collection: ${collection.title}`)
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️ Collection already exists: ${collection.title}`)
      } else {
        console.error(`❌ Failed to create collection ${collection.title}:`, error.message)
      }
    }
  }
}

async function processProductsJSON() {
  const productsPath = path.join(IMPORT_DIR, 'products.json')
  if (!fs.existsSync(productsPath)) {
    console.log('⚠️ products.json not found, skipping...')
    return
  }

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
  
  console.log(`📦 Processing ${products.length} products from JSON...`)
  
  for (const product of products) {
    try {
      // Create product
      const productData = {
        title: product.title,
        handle: product.handle,
        description: product.description,
        status: product.status || 'published',
        collection_id: product.collection_id,
        tags: product.tags || [],
        images: product.images || []
      }

      const productResponse = await axios.post(`${MEDUSA_URL}/admin/products`, productData, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })

      const createdProduct = productResponse.data.product
      
      // Create variant
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants[0]
        const variantData = {
          title: variant.title || 'Default Variant',
          prices: variant.prices || [{ amount: 2999, currency_code: 'usd' }],
          inventory_quantity: variant.inventory_quantity || 100
        }

        await axios.post(`${MEDUSA_URL}/admin/products/${createdProduct.id}/variants`, variantData, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
      }

      console.log(`✅ Created product: ${product.title}`)
    } catch (error) {
      console.error(`❌ Failed to create product ${product.title}:`, error.message)
    }
  }
}

async function processCSVFile(csvFile) {
  return new Promise((resolve, reject) => {
    const products = []
    
    fs.createReadStream(csvFile)
      .pipe(csv({
        separator: ';',
        mapHeaders: ({ header }) => header.replace(/"/g, '').trim(),
        mapValues: ({ value }) => value.replace(/"/g, '').trim()
      }))
      .on('data', (row) => {
        if (row['Row type'] === 'product_variant') {
          products.push(row)
        }
      })
      .on('end', () => {
        console.log(`📄 Processed ${products.length} products from ${path.basename(csvFile)}`)
        resolve(products)
      })
      .on('error', reject)
  })
}

async function processCSVProducts(salesChannelId) {
  const csvFiles = [
    path.join(IMPORT_DIR, 'Lingerie.csv'),
    path.join(IMPORT_DIR, 'Toys.csv')
  ]
  
  let totalProducts = 0
  
  for (const csvFile of csvFiles) {
    if (!fs.existsSync(csvFile)) {
      console.log(`⚠️ ${path.basename(csvFile)} not found, skipping...`)
      continue
    }
    
    console.log(`\n📊 Processing ${path.basename(csvFile)}...`)
    const products = await processCSVFile(csvFile)
    
    for (const product of products) {
      try {
        // Extract product data from CSV
        const productData = {
          title: product['Product name'],
          handle: product['Title'] ? product['Title'].toLowerCase().replace(/[^a-z0-9]/g, '-') : 
                  product['Product name'].toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: product['Description'] || product['Summary'] || '',
          status: 'published',
          images: []
        }
        
        // Add images if available
        for (let i = 1; i <= 20; i++) {
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
        
        // Create variant with price
        const priceAmount = Math.round(parseFloat(product['Price'] || '29.99') * 100) // Convert to cents
        const variantData = {
          title: product['SKU name'] || 'Default',
          prices: [{ amount: priceAmount, currency_code: 'gbp' }],
          inventory_quantity: parseInt(product['In stock']) || 10
        }
        
        await axios.post(`${MEDUSA_URL}/admin/products/${createdProduct.id}/variants`, variantData, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
        
        // Link to sales channel
        if (salesChannelId) {
          try {
            await axios.post(`${MEDUSA_URL}/admin/products/${createdProduct.id}/sales-channels`, {
              sales_channel_id: salesChannelId
            }, {
              headers: { 'Authorization': `Bearer ${adminToken}` }
            })
          } catch (error) {
            console.log(`⚠️ Failed to link product to sales channel: ${error.message}`)
          }
        }
        
        totalProducts++
        console.log(`✅ Created product: ${product['Product name']}`)
        
      } catch (error) {
        console.error(`❌ Failed to create product ${product['Product name']}:`, error.message)
      }
    }
  }
  
  return totalProducts
}

async function main() {
  try {
    console.log('🚀 Starting import from docs/import...\n')
    
    // Login
    await login()
    
    // Create/get sales channel
    const salesChannelId = await createSalesChannel()
    
    // Process collections
    await processCollections()
    
    // Process JSON products
    await processProductsJSON()
    
    // Process CSV products
    const csvProductsCount = await processCSVProducts(salesChannelId)
    
    console.log('\n🎉 Import completed!')
    console.log(`📊 Total products imported: ${csvProductsCount}`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()
