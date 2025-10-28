const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

let authToken = ''

async function login() {
  try {
    console.log('🔐 Logging in to Medusa admin...')
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    authToken = response.data.token
    console.log('✅ Successfully logged in')
    return response.data.token
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
    throw error
  }
}

async function createCategories() {
  console.log('\n📁 Creating adult categories...')
  
  const categories = [
    {
      name: "Lingerie & Intimate Apparel",
      handle: "lingerie",
      description: "Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes.",
      metadata: {
        image: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
      }
    },
    {
      name: "Adult Toys & Vibrators",
      handle: "adult-toys",
      description: "High-quality adult toys, vibrators, and intimate accessories from leading brands.",
      metadata: {
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
      }
    },
    {
      name: "Couples & Gift Sets",
      handle: "couples-gifts",
      description: "Perfect products for couples including gift sets, advent calendars, and intimate accessories.",
      metadata: {
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
      }
    },
    {
      name: "Adult Accessories & Essentials",
      handle: "adult-accessories",
      description: "Essential adult accessories including lubricants, cleaners, bondage gear, and care products.",
      metadata: {
        image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
      }
    }
  ]

  const createdCategories = []

  // Try to create categories via admin UI creation endpoint
  for (const category of categories) {
    try {
      console.log(`📁 Creating category: ${category.name}`)
      
      const response = await axios.post(
        `${MEDUSA_URL}/admin/product-categories`,
        category,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log(`✅ Created category: ${response.data.product_category?.name || response.data.category?.name}`)
      createdCategories.push({
        id: response.data.product_category?.id || response.data.category?.id,
        handle: category.handle,
        name: category.name
      })
      
    } catch (error) {
      console.error(`⚠️  Category creation failed:`, error.response?.data?.message || error.message)
    }
  }

  return createdCategories
}

async function importProductsFromCSV() {
  console.log('\n📦 Importing products from CSV...')
  
  try {
    // Read CSV file
    const csvPath = './adult-products.csv'
    if (!fs.existsSync(csvPath)) {
      throw new Error('CSV file not found: ' + csvPath)
    }

    // Create form data
    const form = new FormData()
    form.append('file', fs.createReadStream(csvPath), 'adult-products.csv')

    console.log('📤 Uploading CSV file...')
    
    // Upload CSV
    const uploadResponse = await axios.post(
      `${MEDUSA_URL}/admin/products/import`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          ...form.getHeaders()
        }
      }
    )

    console.log('✅ CSV uploaded successfully!')
    console.log(`📊 Import summary:`)
    console.log(`   Products to create: ${uploadResponse.data.summary?.toCreate || 0}`)
    console.log(`   Products to update: ${uploadResponse.data.summary?.toUpdate || 0}`)
    
    const transactionId = uploadResponse.data.transaction_id
    console.log(`🔄 Transaction ID: ${transactionId}`)
    
    // Confirm the import
    console.log('\n🔄 Confirming import...')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before confirming
    
    const confirmResponse = await axios.post(
      `${MEDUSA_URL}/admin/products/import/${transactionId}/confirm`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('✅ Import confirmed!')
    console.log('📦 Products have been imported successfully!')
    
    return {
      created: uploadResponse.data.summary?.toCreate || 0,
      updated: uploadResponse.data.summary?.toUpdate || 0
    }
    
  } catch (error) {
    console.error('❌ CSV import failed:', error.response?.data || error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting automatic products import using CSV...')
  
  try {
    // Login
    await login()
    
    // Create categories first (if possible)
    const categories = await createCategories()
    console.log(`📁 Categories status: ${categories.length} created`)
    
    // Import products from CSV
    const { created, updated } = await importProductsFromCSV()
    
    console.log('\n🎉 Import completed!')
    console.log(`✅ Successfully created: ${created} products`)
    console.log(`✅ Successfully updated: ${updated} products`)
    console.log(`📁 Categories: ${categories.length}`)
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    console.log(`   Cart: http://localhost:8001/cart`)
    
    // Wait a moment and then check products
    console.log('\n🔍 Checking imported products...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    try {
      const productsResponse = await axios.get(
        `${MEDUSA_URL}/store/products`,
        {
          headers: {
            'x-publishable-api-key': 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
          }
        }
      )
      
      console.log(`📦 Total products in store: ${productsResponse.data.count}`)
      console.log('🎉 Import process completed successfully!')
      
    } catch (error) {
      console.log('⚠️  Could not verify products, but import likely succeeded')
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

// Install form-data if not available
try {
  require('form-data')
} catch (e) {
  console.log('📦 Installing form-data package...')
  const { execSync } = require('child_process')
  execSync('npm install form-data', { stdio: 'inherit' })
}

main().catch(console.error)
