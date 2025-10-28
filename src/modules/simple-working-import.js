const axios = require('axios')

// Simple working import script
async function importAdultProducts() {
  const MEDUSA_URL = 'http://localhost:9000'
  const PUBLISHABLE_KEY = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
  
  console.log('🚀 Starting Simple Product Import...')
  
  try {
    // Get admin token
    console.log('🔐 Getting admin token...')
    const authResponse = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    })
    
    const token = authResponse.data.token
    console.log('✅ Admin token obtained')
    
    // Use x-medusa-access-token header (works for Medusa v2)
    const headers = {
      'x-medusa-access-token': token,
      'Content-Type': 'application/json'
    }
    
    // Create categories first
    console.log('📁 Creating categories...')
    
    const categories = [
      {
        name: "Lingerie & Intimate Apparel",
        handle: "lingerie",
        description: "Premium lingerie and intimate apparel",
        metadata: { image: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400" }
      },
      {
        name: "Adult Toys & Vibrators", 
        handle: "adult-toys",
        description: "High-quality adult toys and vibrators",
        metadata: { image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400" }
      }
    ]
    
    const categoryMap = new Map()
    
    for (const category of categories) {
      try {
        const response = await axios.post(`${MEDUSA_URL}/admin/product-categories`, category, { headers })
        const createdCategory = response.data.product_category
        categoryMap.set(createdCategory.handle, {
          id: createdCategory.id,
          name: createdCategory.name
        })
        console.log(`✅ Created category: ${createdCategory.name}`)
      } catch (error) {
        console.log(`⚠️  Category creation failed: ${category.name}`)
      }
    }
    
    // Create products
    console.log('📦 Creating products...')
    
    const products = [
      {
        title: "Red Lace Mini Dress",
        handle: "red-lace-mini-dress",
        description: "Sexy red lace mini dress with matching G-string and adjustable straps.",
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
        description: "High-quality silicone vibrator with multiple vibration modes.",
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
      }
    ]
    
    let successCount = 0
    
    for (const product of products) {
      try {
        // Map product to category
        const categoryHandle = product.tags[0].value === 'Lingerie' ? 'lingerie' : 'adult-toys'
        const category = categoryMap.get(categoryHandle)
        
        const payload = {
          ...product,
          ...(category && { categories: [{ id: category.id }] })
        }
        
        const response = await axios.post(`${MEDUSA_URL}/admin/products`, payload, { headers })
        console.log(`✅ Created product: ${response.data.product.title}`)
        successCount++
        
        // Add delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Failed to create product: ${product.title}`, error.response?.data?.message)
      }
    }
    
    console.log('\n🎉 Import completed!')
    console.log(`✅ Products created: ${successCount}`)
    console.log(`📁 Categories created: ${categoryMap.size}`)
    
    // Verify import
    console.log('\n🔍 Verifying import...')
    
    const storeResponse = await axios.get(`${MEDUSA_URL}/store/products`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    })
    
    console.log(`📦 Total products in store: ${storeResponse.data.count}`)
    
    // List products
    storeResponse.data.products.slice(0, 5).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title}`)
    })
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
  }
}

importAdultProducts()
