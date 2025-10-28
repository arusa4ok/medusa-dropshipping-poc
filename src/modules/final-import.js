const axios = require('axios')

async function finalImport() {
  const MEDUSA_URL = 'http://localhost:9000'
  const PUBLISHABLE_KEY = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
  const SECRET_API_KEY = "sk_9a0028c107c727e05a5eb2b03f46ec31b031f1319822edeac5fe624769a75d03"
  
  console.log('🚀 FINAL Adult Products Import...')
  
  try {
    // Step 1: Create categories
    console.log('📁 Creating categories...')
    
    const categories = [
      {
        name: "Lingerie & Intimate Apparel",
        handle: "lingerie",
        description: "Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400",
          adult_content: true
        }
      },
      {
        name: "Adult Toys & Vibrators",
        handle: "adult-toys", 
        description: "High-quality adult toys, vibrators, and intimate accessories from leading brands.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
          adult_content: true
        }
      },
      {
        name: "Couples & Gift Sets",
        handle: "couples-gifts",
        description: "Perfect products for couples including gift sets, advent calendars, and intimate accessories.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
          adult_content: true
        }
      },
      {
        name: "Adult Accessories & Essentials",
        handle: "adult-accessories",
        description: "Essential adult accessories including lubricants, cleaners, bondage gear, and care products.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400",
          adult_content: true
        }
      }
    ]
    
    const categoryMap = new Map()
    
    for (const category of categories) {
      try {
        const response = await axios.post(`${MEDUSA_URL}/admin/product-categories`, category, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
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
        console.log(`⚠️  Category ${category.name}: ${error.response?.data?.message || 'Unknown error'}`)
        
        // Try to get existing category
        try {
          const listResponse = await axios.get(`${MEDUSA_URL}/admin/product-categories?handle=${category.handle}`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (listResponse.data.product_categories?.length > 0) {
            const existingCategory = listResponse.data.product_categories[0]
            categoryMap.set(existingCategory.handle, {
              id: existingCategory.id,
              name: existingCategory.name
            })
            console.log(`ℹ️  Using existing category: ${existingCategory.name}`)
          }
        } catch (listError) {
          console.log(`❌ Could not find existing category: ${category.name}`)
        }
      }
    }
    
    console.log(`📁 Categories ready: ${categoryMap.size}`)
    
    // Step 2: Create products
    console.log('📦 Creating products...')
    
    const products = [
      {
        title: "Red Lace Mini Dress",
        handle: "red-lace-mini-dress",
        description: "Sexy red lace mini dress with matching G-string and adjustable straps. Perfect for intimate moments and roleplay.",
        status: "published",
        tags: [{ value: "Lingerie" }, { value: "Sexy" }, { value: "Roleplay" }],
        options: [{
          title: "Size",
          values: ["One Size"]
        }],
        variants: [{
          title: "One Size",
          sku: "DRESS_RED_001",
          prices: [{ currency_code: "usd", amount: 2799 }],
          inventory_quantity: 10,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
        }],
        metadata: {
          brand: "Leg Avenue",
          material: "Polyester",
          colour: "Red",
          adult_content: true,
          gender: "female",
          style: "Lingerie",
          occasion: "Intimate"
        }
      },
      {
        title: "Pink Silicone Vibrator",
        handle: "pink-silicone-vibrator",
        description: "High-quality silicone vibrator with multiple vibration modes. Waterproof and rechargeable for ultimate pleasure.",
        status: "published",
        tags: [{ value: "Adult Toy" }, { value: "Vibrator" }, { value: "Silicone" }],
        options: [{
          title: "Size",
          values: ["Standard"]
        }],
        variants: [{
          title: "Standard",
          sku: "VIBRATOR_PINK_001",
          prices: [{ currency_code: "usd", amount: 3999 }],
          inventory_quantity: 5,
          manage_inventory: true,
          allow_backorder: false
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
          waterproof: true,
          features: ["Multiple Vibration Modes", "Rechargeable", "Waterproof"]
        }
      },
      {
        title: "Black Lace Teddy",
        handle: "black-lace-teddy",
        description: "Elegant black lace teddy with intricate detailing and adjustable straps for perfect fit. Sophisticated and seductive.",
        status: "published",
        tags: [{ value: "Lingerie" }, { value: "Teddy" }, { value: "Black Lace" }],
        options: [{
          title: "Size",
          values: ["One Size"]
        }],
        variants: [{
          title: "One Size",
          sku: "TEDDY_BLACK_001",
          prices: [{ currency_code: "usd", amount: 3499 }],
          inventory_quantity: 7,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
        }],
        metadata: {
          brand: "Leg Avenue",
          material: "Lace",
          colour: "Black",
          adult_content: true,
          gender: "female",
          style: "Teddy",
          features: ["Adjustable Straps", "Intricate Detailing"]
        }
      },
      {
        title: "Rabbit Vibrator",
        handle: "rabbit-vibrator",
        description: "Dual stimulation rabbit vibrator with multiple speeds and patterns for intense pleasure. Made from body-safe materials.",
        status: "published",
        tags: [{ value: "Adult Toy" }, { value: "Rabbit Vibrator" }, { value: "Dual Stimulation" }],
        options: [{
          title: "Size",
          values: ["Standard"]
        }],
        variants: [{
          title: "Standard",
          sku: "RABBIT_VIB_001",
          prices: [{ currency_code: "usd", amount: 5999 }],
          inventory_quantity: 4,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
        }],
        metadata: {
          brand: "Rabbit Co",
          material: "Silicone",
          colour: "Purple",
          adult_content: true,
          gender: "unisex",
          waterproof: true,
          features: ["Dual Stimulation", "Multiple Speeds", "Body-Safe Material"]
        }
      },
      {
        title: "Couples Gift Set",
        handle: "couples-gift-set",
        description: "Perfect gift set for couples including massage oil, handcuffs, and other intimate accessories for exploring together.",
        status: "published",
        tags: [{ value: "Couples" }, { value: "Gift Set" }, { value: "Romantic" }],
        options: [{
          title: "Size",
          values: ["Complete Set"]
        }],
        variants: [{
          title: "Complete Set",
          sku: "COUPLES_SET_001",
          prices: [{ currency_code: "usd", amount: 4999 }],
          inventory_quantity: 8,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
        }],
        metadata: {
          brand: "Various",
          material: "Mixed",
          colour: "Assorted",
          adult_content: true,
          gender: "unisex",
          features: ["Massage Oil", "Handcuffs", "Intimate Accessories"]
        }
      },
      {
        title: "Bondage Starter Kit",
        handle: "bondage-starter-kit",
        description: "Perfect bondage starter kit with restraints, blindfold, and essential accessories for beginners exploring BDSM.",
        status: "published",
        tags: [{ value: "Accessories" }, { value: "Bondage" }, { value: "BDSM" }],
        options: [{
          title: "Size",
          values: ["Beginner Kit"]
        }],
        variants: [{
          title: "Beginner Kit",
          sku: "BONDAGE_KIT_001",
          prices: [{ currency_code: "usd", amount: 2999 }],
          inventory_quantity: 12,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
        }],
        metadata: {
          brand: "Bondage Pro",
          material: "Mixed",
          colour: "Black",
          adult_content: true,
          gender: "unisex",
          features: ["Restraints", "Blindfold", "Beginner Friendly"]
        }
      }
    ]
    
    let successCount = 0
    
    for (const product of products) {
      try {
        console.log(`Creating product: ${product.title}`)
        
        // Determine category based on tags
        let categoryHandle = "adult-accessories"
        if (product.tags.some(tag => tag.value === "Lingerie")) {
          categoryHandle = "lingerie"
        } else if (product.tags.some(tag => tag.value === "Adult Toy")) {
          categoryHandle = "adult-toys"
        } else if (product.tags.some(tag => tag.value === "Couples")) {
          categoryHandle = "couples-gifts"
        }
        
        const category = categoryMap.get(categoryHandle)
        
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
            'Authorization': `Basic ${Buffer.from(`${SECRET_API_KEY}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        })

        console.log(`✅ Created product: ${response.data.product.title}`)
        successCount++
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Failed to create product "${product.title}":`, error.response?.data?.message || error.message)
      }
    }
    
    console.log('\n🎉 FINAL Import completed!')
    console.log(`✅ Products created: ${successCount}/${products.length}`)
    console.log(`📁 Categories created/used: ${categoryMap.size}`)
    
    // Step 3: Verify import
    console.log('\n🔍 Verifying import...')
    
    try {
      const storeResponse = await axios.get(`${MEDUSA_URL}/store/products`, {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_KEY
        }
      })
      
      console.log(`📦 Total products in store: ${storeResponse.data.count}`)
      
      const adultProducts = storeResponse.data.products.filter(p => 
        p.metadata?.adult_content === true ||
        p.handle.includes('dress') || 
        p.handle.includes('vibrator') ||
        p.handle.includes('teddy') ||
        p.handle.includes('bondage') ||
        p.handle.includes('couples')
      )
      
      if (adultProducts.length > 0) {
        console.log(`🔞 Found imported adult products:`)
        adultProducts.slice(0, 10).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.title} - $${(product.variants[0].prices[0].amount / 100).toFixed(2)}`)
        })
      }
      
    } catch (error) {
      console.error('❌ Verification failed:', error.response?.data?.message || error.message)
    }
    
    console.log('\n🌐 Visit your store:')
    console.log(`   Admin: ${MEDUSA_URL}/app/products`)
    console.log(`   Storefront: http://localhost:8001/products`)
    console.log(`   Cart: http://localhost:8001/cart`)
    
    return {
      success: true,
      productsCreated: successCount,
      categoriesUsed: categoryMap.size
    }
    
  } catch (error) {
    console.error('❌ FINAL Import failed:', error.response?.data?.message || error.message)
    throw error
  }
}

finalImport().catch(console.error)
