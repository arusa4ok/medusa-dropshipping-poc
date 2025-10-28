const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

const MEDUSA_URL = 'http://localhost:9000'
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6IiIsImFjdG9yX3R5cGUiOiJhZG1pbiIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLOEpYVkUzVjZWQ1dXWk03S0tRSFRDVkMiLCJhcHBfbWV0YWRhdGEiOnt9LCJ1c2VyX21ldGFkYXRhIjp7fSwiaWF0IjoxNzYxNjM0NTE2LCJleHAiOjE3NjE3MjA5MTZ9.XVSAI9_qs22mdfijwfnbN2FFPgk78sMS-E52evOdJZU'

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
    }
  ]

  const createdCategories = []

  for (const category of categories) {
    try {
      console.log(`📁 Creating category: ${category.name}`)
      
      const response = await axios.post(
        `${MEDUSA_URL}/admin/product-categories`,
        category,
        {
          headers: {
            'x-medusa-access-token': adminToken,
            'Content-Type': 'application/json'
          }
        }
      )
      
      const categoryName = response.data.product_category?.name || response.data.category?.name
      console.log(`✅ Created category: ${categoryName}`)
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
    const csvPath = './adult-products.csv'
    if (!fs.existsSync(csvPath)) {
      throw new Error('CSV file not found: ' + csvPath)
    }

    const form = new FormData()
    form.append('file', fs.createReadStream(csvPath), 'adult-products.csv')

    console.log('📤 Uploading CSV file...')
    
    const uploadResponse = await axios.post(
      `${MEDUSA_URL}/admin/products/import`,
      form,
      {
        headers: {
          'x-medusa-access-token': adminToken,
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
    
    console.log('\n🔄 Confirming import...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const confirmResponse = await axios.post(
      `${MEDUSA_URL}/admin/products/import/${transactionId}/confirm`,
      {},
      {
        headers: {
          'x-medusa-access-token': adminToken,
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
  console.log('🚀 Starting automatic products import using hard token...')
  
  try {
    await createCategories()
    const { created, updated } = await importProductsFromCSV()
    
    console.log('\n🎉 Import completed!')
    console.log(`✅ Successfully created: ${created} products`)
    console.log(`✅ Successfully updated: ${updated} products`)
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
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

main().catch(console.error)
