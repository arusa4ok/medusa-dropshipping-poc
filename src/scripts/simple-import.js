const axios = require('axios')
const fs = require('fs')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

let authToken = ''

// Simple products data
const sampleProducts = [
  {
    title: "Leg Avenue Mini Dress with Lace Up Front",
    handle: "leg-avenue-mini-dress",
    description: "Sexy red lace mini dress with lace-up front and matching G-string",
    status: "published",
    categories: [{ handle: "lingerie" }],
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "SKU_001",
      prices: [{ currency_code: "USD", amount: 2799 }],
      inventory_quantity: 10,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
    }],
    metadata: {
      brand: "Leg Avenue",
      material: "Polyester",
      colour: "Red",
      adult_content: true,
      gender: "female"
    }
  },
  {
    title: "Adult Toy Vibrator",
    handle: "adult-toy-vibrator",
    description: "High-quality vibrator for intimate pleasure",
    status: "published",
    categories: [{ handle: "adult-toys" }],
    tags: [{ value: "Adult Toy" }],
    options: [{ title: "Size", values: ["Standard"] }],
    variants: [{
      title: "Default",
      sku: "SKU_002",
      prices: [{ currency_code: "USD", amount: 3999 }],
      inventory_quantity: 5,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
    }],
    metadata: {
      brand: "DreamToys",
      material: "Silicone",
      colour: "Pink",
      adult_content: true,
      gender: "unisex",
      waterproof: true
    }
  }
]

async function login() {
  try {
    console.log('🔐 Logging in...')
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    authToken = response.data.token
    console.log('✅ Logged in successfully')
    return response.data.token
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
    throw error
  }
}

async function createCategories() {
  console.log('\n📁 Creating categories...')
  
  const categories = [
    {
      name: 'Lingerie & Intimate Apparel',
      handle: 'lingerie',
      description: 'Premium lingerie and intimate apparel',
      metadata: { image: 'https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400' }
    },
    {
      name: 'Adult Toys & Vibrators',
      handle: 'adult-toys',
      description: 'High-quality adult toys and vibrators',
      metadata: { image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400' }
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
        handle: response.data.product_category.handle
      })
    } catch (error) {
      console.error(`❌ Error creating category:`, error.response?.data?.message || error.message)
    }
  }

  return createdCategories
}

async function createProducts() {
  console.log('\n📦 Creating products...')
  
  let successCount = 0
  
  for (let i = 0; i < sampleProducts.length; i++) {
    const product = sampleProducts[i]
    
    try {
      console.log(`Creating product ${i + 1}/${sampleProducts.length}: ${product.title}`)
      
      const response = await axios.post(
        `${MEDUSA_URL}/admin/products`,
        product,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log(`✅ Created: ${response.data.product.title}`)
      successCount++
      
    } catch (error) {
      console.error(`❌ Error creating product:`, error.response?.data?.message || error.message)
    }
  }

  return successCount
}

async function main() {
  console.log('🚀 Starting simple import to Medusa backend...')
  
  try {
    // Login
    await login()
    
    // Create categories
    await createCategories()
    
    // Create products
    const successCount = await createProducts()
    
    console.log('\n🎉 Import completed!')
    console.log(`✅ Successfully created: ${successCount} products`)
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
