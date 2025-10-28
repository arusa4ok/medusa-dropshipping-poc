const axios = require('axios')

async function workingImport() {
  const MEDUSA_URL = 'http://localhost:9000'
  const PUBLISHABLE_KEY = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
  
  console.log('🚀 Starting WORKING Medusa Import...')
  
  try {
    // Step 1: Get admin JWT token
    console.log('🔐 Getting admin JWT token...')
    const authResponse = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    })
    
    const jwtToken = authResponse.data.token
    console.log('✅ JWT token obtained')
    
    // Step 2: Create secret API key
    console.log('🔑 Creating secret API key...')
    const apiKeyResponse = await axios.post(`${MEDUSA_URL}/admin/api-keys`, {
      title: "Import Script Key",
      type: "secret"
    }, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    const secretToken = apiKeyResponse.data.api_key.token
    console.log('✅ Secret API key created')
    
    // Step 3: Create categories
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
        const response = await axios.post(`${MEDUSA_URL}/admin/product-categories`, category, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        })
        
        const createdCategory = response.data.product_category
        categoryMap.set(createdCategory.handle, {
          id: createdCategory.id,
          name: createdCategory.name
        })
        console.log(`✅ Created category: ${createdCategory.name}`)
        
      } catch (error) {
        console.log(`⚠️  Category creation failed: ${category.name} - ${error.response?.data?.message}`)
      }
    }
    
    // Step 4: Create products
    console.log('📦 Creating products...')
    
    const products = [
      {
        title: "Red Lace Mini Dress",
        handle: "red-lace-mini-dress",
        description: "Sexy red lace mini dress with matching G-string and adjustable straps.",
        status: "published",
        tags: [{ value: "Lingerie" }],
        categoryHandle: "lingerie",
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
        categoryHandle: "adult-toys",
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
        console.log(`Creating product: ${product.title}`)
        
        const category = categoryMap.get(product.categoryHandle)
        
        const payload = {
          title: product.title,
          handle: product.handle,
          description: product.description,
          status: product.status,
          tags: product.tags,
          options: product.options,
          variants: product.variants,
          images: product.images,
          metadata: product.metadata,
          ...(category && { categories: [{ id: category.id }] })
        }

        const response = await axios.post(`${MEDUSA_URL}/admin/products`, payload, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        })

        console.log(`✅ Created product: ${response.data.product.title}`)
        successCount++
        
        // Add delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Failed to create product "${product.title}":`, error.response?.data?.message)
      }
    }
    
    console.log('\n🎉 WORKING Import completed!')
    console.log(`✅ Products created: ${successCount}`)
    console.log(`📁 Categories created: ${categoryMap.size}`)
    
    // Step 5: Verify import
    console.log('\n🔍 Verifying import...')
    
    const storeResponse = await axios.get(`${MEDUSA_URL}/store/products`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    })
    
    console.log(`📦 Total products in store: ${storeResponse.data.count}`)
    
    // Find imported products
    const importedProducts = storeResponse.data.products.filter(p => 
      p.metadata?.adult_content === true
    )
    
    if (importedProducts.length > 0) {
      console.log(`🔞 Found imported adult products:`)
      importedProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title}`)
      })
    }
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
    return {
      success: true,
      productsCreated: successCount,
      categoriesCreated: categoryMap.size
    }
    
  } catch (error) {
    console.error('❌ WORKING Import failed:', error.response?.data?.message || error.message)
    throw error
  }
}

workingImport().catch(console.error)
