const axios = require('axios')

class CorrectMedusaImporter {
  constructor() {
    this.medusaUrl = 'http://localhost:9000'
    this.publishableKey = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
    this.adminCredentials = {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    }
    this.logger = {
      info: (...args) => console.log('ℹ️ ', ...args),
      success: (...args) => console.log('✅ ', ...args),
      warn: (...args) => console.log('⚠️ ', ...args),
      error: (...args) => console.log('❌ ', ...args)
    }
  }

  async getAdminJWTToken() {
    try {
      this.logger.info('🔐 Getting admin JWT token...')
      
      // Use the correct endpoint: /auth/user/emailpass (not /auth/admin/emailpass)
      const response = await axios.post(`${this.medusaUrl}/auth/user/emailpass`, {
        email: this.adminCredentials.email,
        password: this.adminCredentials.password
      })

      const token = response.data.token
      this.logger.success(`✅ JWT token obtained: ${token.substring(0, 20)}...`)
      return token
      
    } catch (error) {
      this.logger.error('❌ Failed to get JWT token:', error.response?.data?.message || error.message)
      throw error
    }
  }

  async createSecretAPIKey(jwtToken) {
    try {
      this.logger.info('🔑 Creating secret API key...')
      
      const response = await axios.post(`${this.medusaUrl}/admin/api-keys`, {
        title: "Import Script Key",
        type: "secret"
      }, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      })

      const secretToken = response.data.api_key.token
      this.logger.success(`✅ Secret API key created: ${secretToken.substring(0, 20)}...`)
      return secretToken
      
    } catch (error) {
      this.logger.error('❌ Failed to create API key:', error.response?.data?.message || error.message)
      throw error
    }
  }

  async createCategories(secretToken) {
    this.logger.info('📁 Creating categories...')
    
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

    const categoryMap = new Map()
    
    for (const category of categories) {
      try {
        const response = await axios.post(`${this.medusaUrl}/admin/product-categories`, category, {
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
        
        this.logger.success(`✅ Created category: ${createdCategory.name}`)
        
      } catch (error) {
        // Check if category already exists
        if (error.response?.data?.message?.includes('already exists')) {
          this.logger.warn(`⚠️  Category already exists: ${category.name}`)
          // Try to get existing category
          try {
            const listResponse = await axios.get(`${this.medusaUrl}/admin/product-categories?handle=${category.handle}`, {
              headers: {
                'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
                'Content-Type': 'application/json'
              }
            })
            
            if (listResponse.data.product_categories?.length > 0) {
              const existingCategory = listResponse.data.product_categories[0]
              categoryMap.set(existingCategory.handle, {
                id: existingCategory.id,
                name: existingCategory.name
              })
              this.logger.info(`ℹ️  Using existing category: ${existingCategory.name}`)
            }
          } catch (listError) {
            this.logger.error(`❌ Could not find existing category: ${category.name}`)
          }
        } else {
          this.logger.error(`❌ Failed to create category "${category.name}":`, error.response?.data?.message)
        }
      }
    }

    return categoryMap
  }

  async createProducts(secretToken, categoryMap) {
    this.logger.info('📦 Creating products...')
    
    const products = [
      {
        title: "Red Lace Mini Dress",
        handle: "red-lace-mini-dress",
        description: "Sexy red lace mini dress with matching G-string and adjustable straps. Perfect for intimate moments and roleplay.",
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
        description: "High-quality silicone vibrator with multiple vibration modes. Waterproof and rechargeable for ultimate pleasure.",
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
      },
      {
        title: "Black Lace Teddy",
        handle: "black-lace-teddy",
        description: "Elegant black lace teddy with intricate detailing and adjustable straps for perfect fit.",
        status: "published",
        tags: [{ value: "Lingerie" }],
        categoryHandle: "lingerie",
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
      },
      {
        title: "Rabbit Vibrator",
        handle: "rabbit-vibrator",
        description: "Dual stimulation rabbit vibrator with multiple speeds and patterns for intense pleasure.",
        status: "published",
        tags: [{ value: "Adult Toy" }],
        categoryHandle: "adult-toys",
        options: [{ title: "Size", values: ["Standard"] }],
        variants: [{
          title: "Default",
          sku: "RABBIT_VIB_001",
          prices: [{ currency_code: "USD", amount: 5999 }],
          inventory_quantity: 4,
          manage_inventory: true
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
          waterproof: true
        }
      },
      {
        title: "Couples Gift Set",
        handle: "couples-gift-set",
        description: "Perfect gift set for couples including massage oil, handcuffs, and other intimate accessories.",
        status: "published",
        tags: [{ value: "Couples" }],
        categoryHandle: "couples-gifts",
        options: [{ title: "Size", values: ["One Size"] }],
        variants: [{
          title: "Default",
          sku: "COUPLES_SET_001",
          prices: [{ currency_code: "USD", amount: 4999 }],
          inventory_quantity: 8,
          manage_inventory: true
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
        }],
        metadata: {
          brand: "Various",
          material: "Mixed",
          colour: "Assorted",
          adult_content: true,
          gender: "unisex"
        }
      },
      {
        title: "Bondage Starter Kit",
        handle: "bondage-starter-kit",
        description: "Perfect bondage starter kit with restraints, blindfold, and accessories for beginners.",
        status: "published",
        tags: [{ value: "Accessories" }],
        categoryHandle: "adult-accessories",
        options: [{ title: "Size", values: ["One Size"] }],
        variants: [{
          title: "Default",
          sku: "BONDAGE_KIT_001",
          prices: [{ currency_code: "USD", amount: 2999 }],
          inventory_quantity: 12,
          manage_inventory: true
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
        }],
        metadata: {
          brand: "Bondage Pro",
          material: "Mixed",
          colour: "Black",
          adult_content: true,
          gender: "unisex"
        }
      }
    ]

    let successCount = 0
    
    for (const product of products) {
      try {
        this.logger.info(`Creating product: ${product.title}`)
        
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

        const response = await axios.post(`${this.medusaUrl}/admin/products`, payload, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        })

        this.logger.success(`✅ Created product: ${response.data.product.title}`)
        successCount++
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        this.logger.error(`❌ Failed to create product "${product.title}":`, error.response?.data?.message)
      }
    }

    return successCount
  }

  async verifyImport() {
    try {
      this.logger.info('🔍 Verifying import...')
      
      const response = await axios.get(`${this.medusaUrl}/store/products`, {
        headers: {
          'x-publishable-api-key': this.publishableKey
        }
      })

      const productsCount = response.data.count || 0
      this.logger.success(`📦 Total products in store: ${productsCount}`)

      // List the imported adult products
      const adultProducts = response.data.products.filter(p => 
        p.metadata?.adult_content === true || 
        p.handle.includes('dress') || 
        p.handle.includes('vibrator') ||
        p.handle.includes('teddy')
      )

      if (adultProducts.length > 0) {
        this.logger.success(`🔞 Found ${adultProducts.length} adult products:`)
        adultProducts.slice(0, 5).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.title} (${product.handle})`)
        })
      }

      return { total: productsCount, adult: adultProducts.length }
      
    } catch (error) {
      this.logger.error('❌ Verification failed:', error.response?.data?.message || error.message)
      return null
    }
  }

  async runCorrectImport() {
    try {
      this.logger.info('🚀 Starting CORRECT Medusa Import Module...')
      
      // Step 1: Get JWT token using correct endpoint
      const jwtToken = await this.getAdminJWTToken()
      
      // Step 2: Create secret API key for programmatic access
      const secretToken = await this.createSecretAPIKey(jwtToken)
      
      // Step 3: Create categories
      const categoryMap = await this.createCategories(secretToken)
      
      // Step 4: Create products
      const productsCreated = await this.createProducts(secretToken, categoryMap)
      
      this.logger.success('\n🎉 CORRECT Import completed!')
      this.logger.success(`✅ Products created: ${productsCreated}`)
      this.logger.success(`📁 Categories created/used: ${categoryMap.size}`)
      
      // Step 5: Verify import
      const verification = await this.verifyImport()
      
      if (verification) {
        this.logger.info('\n📊 Final Results:')
        this.logger.info(`📦 Total products: ${verification.total}`)
        this.logger.info(`🔞 Adult products: ${verification.adult}`)
      }
      
      console.log('\n🌐 You can now visit:')
      console.log(`   Admin: ${this.medusaUrl}/app`)
      console.log(`   Storefront: http://localhost:8001/products`)
      console.log(`   Cart: http://localhost:8001/cart`)
      
      return {
        success: true,
        productsCreated,
        categoriesUsed: categoryMap.size,
        verification
      }
      
    } catch (error) {
      this.logger.error('❌ CORRECT Import failed:', error.message)
      throw error
    }
  }
}

async function runCorrectImport() {
  const importer = new CorrectMedusaImporter()
  return await importer.runCorrectImport()
}

module.exports = { CorrectMedusaImporter, runCorrectImport }

if (require.main === module) {
  runCorrectImport().catch(console.error)
}
