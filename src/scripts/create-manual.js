const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const PUBLISHABLE_KEY = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'

// Adult products data - simplified version for direct creation
const products = [
  {
    title: "Red Lace Mini Dress",
    handle: "red-lace-mini-dress",
    description: "Sexy red lace mini dress with matching G-string and adjustable straps. Perfect for intimate moments and roleplay.",
    status: "published",
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "DRESS_RED_001",
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
    title: "Pink Silicone Vibrator",
    handle: "pink-silicone-vibrator",
    description: "High-quality silicone vibrator with multiple vibration modes. Waterproof and rechargeable for ultimate pleasure.",
    status: "published",
    tags: [{ value: "Adult Toy" }],
    options: [{ title: "Size", values: ["Standard"] }],
    variants: [{
      title: "Default",
      sku: "VIBRATOR_PINK_001",
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
  },
  {
    title: "Black Lace Teddy",
    handle: "black-lace-teddy",
    description: "Elegant black lace teddy with intricate detailing and adjustable straps for perfect fit.",
    status: "published",
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "TEDDY_BLACK_001",
      prices: [{ currency_code: "USD", amount: 3499 }],
      inventory_quantity: 7,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
    }],
    metadata: {
      brand: "Leg Avenue",
      material: "Lace",
      colour: "Black",
      adult_content: true,
      gender: "female"
    }
  }
]

async function createProductsDirectly() {
  console.log('🚀 Creating products directly via admin UI simulation...')
  
  let successCount = 0
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    
    try {
      console.log(`📦 [${i + 1}/${products.length}] Creating: ${product.title}`)
      
      // Try creating via different possible endpoints
      let created = false
      
      // Method 1: Try /admin/products with cookie auth
      try {
        // Get admin session
        const loginResponse = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
          email: 'admin@medusa-test.com',
          password: 'supersecret'
        })
        
        const cookies = loginResponse.headers['set-cookie']
        const cookieHeader = cookies ? cookies.join('; ') : ''
        
        const response = await axios.post(
          `${MEDUSA_URL}/admin/products`,
          product,
          {
            headers: {
              'Cookie': cookieHeader,
              'Content-Type': 'application/json'
            }
          }
        )
        
        console.log(`✅ Created via cookie auth: ${response.data.product?.title || response.data.title}`)
        successCount++
        created = true
        
      } catch (cookieError) {
        console.log(`⚠️  Cookie auth failed: ${cookieError.response?.status}`)
      }
      
      if (!created) {
        console.log(`❌ Failed to create: ${product.title}`)
      }
      
      // Add delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`❌ Error creating product ${product.title}:`, error.response?.status, error.response?.data?.message || error.message)
    }
  }

  return successCount
}

async function checkProducts() {
  console.log('\n🔍 Checking products in store...')
  
  try {
    const response = await axios.get(`${MEDUSA_URL}/store/products`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    })
    
    console.log(`📦 Total products: ${response.data.count}`)
    
    response.data.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} (${product.handle})`)
    })
    
  } catch (error) {
    console.error('❌ Error checking products:', error.message)
  }
}

async function main() {
  console.log('🚀 Starting direct product creation...')
  
  try {
    await checkProducts()
    
    const successCount = await createProductsDirectly()
    
    console.log('\n🎉 Creation completed!')
    console.log(`✅ Successfully created: ${successCount} products`)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    await checkProducts()
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
  } catch (error) {
    console.error('❌ Process failed:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
