const axios = require('axios')

// ПРАВИЛЬНЫЙ AUTH FLOW согласно документации Medusa v2
class CorrectMedusaAuth {
  constructor() {
    this.medusaUrl = 'http://localhost:9000'
    this.publishableKey = 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
    this.logger = {
      info: (...args) => console.log('ℹ️ ', ...args),
      success: (...args) => console.log('✅ ', ...args),
      warn: (...args) => console.log('⚠️ ', ...args),
      error: (...args) => console.log('❌ ', ...args)
    }
  }

  // Step 1: Get JWT token через правильный endpoint
  async getJWTToken() {
    try {
      this.logger.info('🔐 Step 1: Getting JWT token...')
      
      // Используем /auth/admin/emailpass для admin user
      const response = await axios.post(`${this.medusaUrl}/auth/admin/emailpass`, {
        email: 'admin@medusa-test.com',
        password: 'supersecret'
      })

      const token = response.data.token
      this.logger.success(`✅ JWT token: ${token.substring(0, 30)}...`)
      return token
      
    } catch (error) {
      this.logger.error('❌ JWT token failed:', error.response?.data?.message)
      throw error
    }
  }

  // Step 2: Создать secret API key используя JWT token
  async createSecretAPIKey(jwtToken) {
    try {
      this.logger.info('🔑 Step 2: Creating secret API key...')
      
      const response = await axios.post(`${this.medusaUrl}/admin/api-keys`, {
        title: "Adult Import Script Key",
        type: "secret"
      }, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      })

      const secretToken = response.data.api_key.token
      this.logger.success(`✅ Secret API key: ${secretToken.substring(0, 30)}...`)
      return secretToken
      
    } catch (error) {
      this.logger.error('❌ API key creation failed:', error.response?.data?.message)
      throw error
    }
  }

  // Step 3: Использовать Basic auth с secret API key
  async testAPIKey(secretToken) {
    try {
      this.logger.info('🧪 Step 3: Testing API key authentication...')
      
      // Согласно документации: Basic auth с secret token
      const response = await axios.get(`${this.medusaUrl}/admin/products`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })

      this.logger.success(`✅ API key works! Found ${response.data.count} products`)
      return true
      
    } catch (error) {
      this.logger.error('❌ API key test failed:', error.response?.data?.message)
      return false
    }
  }

  // Step 4: Создать категории и продукты
  async importAdultProducts(secretToken) {
    try {
      this.logger.info('📦 Step 4: Importing adult products...')
      
      // Создаем категории
      const categories = [
        {
          name: "Lingerie & Intimate Apparel",
          handle: "lingerie",
          description: "Premium lingerie and intimate apparel",
          metadata: { adult_content: true }
        },
        {
          name: "Adult Toys & Vibrators",
          handle: "adult-toys",
          description: "High-quality adult toys and vibrators", 
          metadata: { adult_content: true }
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
          this.logger.success(`✅ Category created: ${createdCategory.name}`)
          
        } catch (error) {
          this.logger.warn(`⚠️  Category ${category.name}: ${error.response?.data?.message}`)
        }
      }

      // Создаем продукты
      const products = [
        {
          title: "Red Lace Mini Dress",
          handle: "red-lace-mini-dress",
          description: "Sexy red lace mini dress",
          status: "published",
          tags: [{ value: "Lingerie" }],
          categoryHandle: "lingerie",
          options: [{ title: "Size", values: ["One Size"] }],
          variants: [{
            title: "One Size",
            sku: "DRESS_RED_001",
            prices: [{ currency_code: "usd", amount: 2799 }],
            inventory_quantity: 10,
            manage_inventory: true
          }],
          images: [{
            url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
          }],
          metadata: {
            brand: "Leg Avenue",
            adult_content: true
          }
        },
        {
          title: "Pink Silicone Vibrator",
          handle: "pink-silicone-vibrator",
          description: "High-quality silicone vibrator",
          status: "published", 
          tags: [{ value: "Adult Toy" }],
          categoryHandle: "adult-toys",
          options: [{ title: "Size", values: ["Standard"] }],
          variants: [{
            title: "Standard",
            sku: "VIBRATOR_PINK_001",
            prices: [{ currency_code: "usd", amount: 3999 }],
            inventory_quantity: 5,
            manage_inventory: true
          }],
          images: [{
            url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
          }],
          metadata: {
            brand: "DreamToys",
            adult_content: true
          }
        }
      ]

      let successCount = 0
      
      for (const product of products) {
        try {
          this.logger.info(`Creating product: ${product.title}`)
          
          const category = categoryMap.get(product.categoryHandle)
          
          const payload = {
            ...product,
            ...(category && { categories: [{ id: category.id }] })
          }

          const response = await axios.post(`${this.medusaUrl}/admin/products`, payload, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
              'Content-Type': 'application/json'
            }
          })

          this.logger.success(`✅ Product created: ${response.data.product.title}`)
          successCount++
          
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          this.logger.error(`❌ Product "${product.title}" failed:`, error.response?.data?.message)
        }
      }

      return {
        successCount,
        categoriesCount: categoryMap.size
      }
      
    } catch (error) {
      this.logger.error('❌ Import failed:', error.message)
      throw error
    }
  }

  // Главный метод с полным flow
  async runCompleteFlow() {
    try {
      this.logger.info('🚀 Starting COMPLETE Medusa Auth Flow...')
      
      // Step 1: JWT token
      const jwtToken = await this.getJWTToken()
      
      // Step 2: Secret API key  
      const secretToken = await this.createSecretAPIKey(jwtToken)
      
      // Step 3: Test API key
      const apiWorks = await this.testAPIKey(secretToken)
      if (!apiWorks) {
        throw new Error('API key authentication failed')
      }
      
      // Step 4: Import products
      const result = await this.importAdultProducts(secretToken)
      
      this.logger.success('\n🎉 COMPLETE Flow Success!')
      this.logger.success(`✅ Products created: ${result.successCount}`)
      this.logger.success(`📁 Categories created: ${result.categoriesCount}`)
      
      // Verification
      this.logger.info('\n🔍 Verifying in store...')
      const storeResponse = await axios.get(`${this.medusaUrl}/store/products`, {
        headers: {
          'x-publishable-api-key': this.publishableKey
        }
      })
      
      this.logger.success(`📦 Total products in store: ${storeResponse.data.count}`)
      
      console.log('\n🌐 Store is ready:')
      console.log(`   Admin: ${this.medusaUrl}/app/products`)
      console.log(`   Storefront: http://localhost:8001/products`)
      
      return result
      
    } catch (error) {
      this.logger.error('❌ COMPLETE Flow failed:', error.message)
      throw error
    }
  }
}

// Запуск
async function runCorrectAuthFlow() {
  const auth = new CorrectMedusaAuth()
  return await auth.runCompleteFlow()
}

runCorrectAuthFlow().catch(console.error)

module.exports = { CorrectMedusaAuth, runCorrectAuthFlow }
