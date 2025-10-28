const axios = require('axios')
const fs = require('fs')
const path = require('path')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

let authToken = ''

// Read import data
const importDataPath = '/Users/rusakovanton/projects/medusa-dropshipping-poc/docs/import'
const productsPath = path.join(importDataPath, 'products.json')
const collectionsPath = path.join(importDataPath, 'collections.json')

let products = []
let collections = []

// Try to read import data
try {
  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    console.log(`✅ Loaded ${products.length} products from import data`)
  }
  
  if (fs.existsSync(collectionsPath)) {
    collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'))
    console.log(`✅ Loaded ${collections.length} collections from import data`)
  }
} catch (error) {
  console.error('❌ Error reading import data:', error.message)
}

async function login() {
  try {
    console.log(`Attempting login to: ${MEDUSA_URL}/auth/admin/emailpass`)
    console.log(`Email: ${ADMIN_EMAIL}`)
    
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    
    console.log('Login response status:', response.status)
    console.log('Login response data:', response.data)
    
    authToken = response.data.token
    console.log('✅ Logged in to admin')
    console.log('Token:', authToken ? 'Received' : 'Missing')
    return response.data.token
  } catch (error) {
    console.error('❌ Login failed:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    throw error
  }
}

async function createCategories() {
  console.log('\n📁 Creating categories...')
  
  const categories = [
    {
      name: 'Lingerie & Intimate Apparel',
      handle: 'lingerie',
      description: 'Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes from top brands like Leg Avenue and Prowler.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400'
      }
    },
    {
      name: 'Adult Toys & Vibrators',
      handle: 'adult-toys',
      description: 'High-quality adult toys, vibrators, dildos, and intimate accessories from leading brands like Fleshlight, Dreamtoys, and Creature Cocks.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'
      }
    },
    {
      name: 'Couples & Gift Sets',
      handle: 'couples-gifts',
      description: 'Perfect products for couples including gift sets, advent calendars, couples toys, and intimate accessories for shared pleasure.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
      }
    },
    {
      name: 'Adult Accessories & Essentials',
      handle: 'adult-accessories',
      description: 'Essential adult accessories including lubricants, cleaners, bondage gear, and intimate care products.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400'
      }
    }
  ]

  const createdCategories = []

  for (const category of categories) {
    try {
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
      console.log(`✅ Created category: ${response.data.product_category.name}`)
      createdCategories.push({
        id: response.data.product_category.id,
        handle: response.data.product_category.handle,
        name: response.data.product_category.name
      })
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error.response?.data?.message || error.message)
    }
  }

  return createdCategories
}

async function createSalesChannel() {
  console.log('\n🛍️ Creating sales channel...')
  
  try {
    const response = await axios.post(
      `${MEDUSA_URL}/admin/sales-channels`,
      {
        name: 'Adult Shop',
        description: 'Adult products store',
        is_active: true
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(`✅ Created sales channel: ${response.data.sales_channel.name}`)
    return response.data.sales_channel.id
  } catch (error) {
    console.error('❌ Error creating sales channel:', error.response?.data?.message || error.message)
    return null
  }
}

async function createProducts(categories, salesChannelId) {
  console.log('\n📦 Creating products...')
  
  // Create category handle to ID map
  const categoryMap = new Map()
  categories.forEach(cat => {
    categoryMap.set(cat.handle, cat.id)
  })

  console.log('Category mapping:', Array.from(categoryMap.entries()))

  // Map collection_id to category_handle
  const collectionMapping = {
    'col_lingerie': 'lingerie',
    'col_toys': 'adult-toys',
    'col_couples': 'couples-gifts',
    'col_accessories': 'adult-accessories'
  }

  let successCount = 0
  let errorCount = 0

  // Use imported products or fallback to basic products
  const productsToImport = products.length > 0 ? products : []

  if (productsToImport.length === 0) {
    console.log('⚠️ No import data found, skipping product creation')
    return { successCount, errorCount }
  }

  for (let i = 0; i < Math.min(productsToImport.length, 20); i++) { // Start with 20 for testing
    const product = productsToImport[i]
    
    try {
      console.log(`\n📦 [${i + 1}/${Math.min(productsToImport.length, 20)}] Creating: ${product.title}`)
      
      // Map collection_id to category_handle
      const categoryHandle = collectionMapping[product.collection_id]
      const categoryId = categoryMap.get(categoryHandle)

      if (!categoryId) {
        console.log(`⚠️  Skipping ${product.title} - no category found for ${product.collection_id}`)
        continue
      }

      // Prepare product data for Medusa v2
      const productData = {
        title: product.title,
        handle: product.handle,
        description: product.description ? product.description.replace(/<[^>]*>/g, '') : '', // Strip HTML
        subtitle: product.subtitle || '',
        status: 'published',
        categories: [{ id: categoryId }],
        sales_channels: salesChannelId ? [{ id: salesChannelId }] : [],
        options: [
          {
            title: 'Size',
            values: product.options?.length > 0 ? 
              product.options[0].values?.map(v => v.value || v) || ['One Size'] : 
              ['One Size']
          }
        ],
        variants: [{
          title: 'Default',
          sku: `SKU_${product.id.slice(-8)}`,
          prices: [{
            currency_code: 'USD',
            amount: product.variants?.[0]?.prices?.[0]?.amount || 9999
          }],
          inventory_quantity: product.variants?.[0]?.inventory_quantity || 10,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: product.images?.slice(0, 3).map(img => ({
          url: img.url.startsWith('http') ? img.url : `https://via.placeholder.com/400x600.png?text=${encodeURIComponent(product.title)}`,
          filename: `${product.handle}-${Math.random().toString(36).substr(2, 9)}.jpg`
        })) || [{
          url: `https://via.placeholder.com/400x600.png?text=${encodeURIComponent(product.title)}`,
          filename: `${product.handle}.jpg`
        }],
        tags: product.tags?.map(tag => ({ value: tag.value })) || [],
        metadata: {
          brand: product.metadata?.brand || product.brand || '',
          material: product.metadata?.material || product.material || '',
          colour: product.metadata?.colour || product.colour || '',
          adult_content: true,
          gender: product.metadata?.gender || product.gender || '',
          import_id: product.metadata?.import_id || '',
          original_id: product.id
        }
      }

      const response = await axios.post(
        `${MEDUSA_URL}/admin/products`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log(`✅ Created: ${response.data.product.title}`)
      console.log(`   Product ID: ${response.data.product.id}`)
      successCount++
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      errorCount++
      console.error(`❌ Error creating product ${product.title}:`, error.response?.data?.message || error.message)
    }
  }

  return { successCount, errorCount }
}

async function main() {
  console.log('🚀 Starting automatic data import to Medusa backend...')
  
  try {
    // Login
    await login()
    
    // Create categories
    const categories = await createCategories()
    
    // Create sales channel
    const salesChannelId = await createSalesChannel()
    
    // Create products
    const { successCount, errorCount } = await createProducts(categories, salesChannelId)
    
    console.log('\n🎉 Import completed!')
    console.log(`✅ Successfully created: ${successCount} products`)
    console.log(`❌ Failed to create: ${errorCount} products`)
    console.log(`📁 Created ${categories.length} categories`)
    console.log(`🛍️ Sales channel: ${salesChannelId ? 'Created' : 'Failed'}`)
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
