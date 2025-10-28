const axios = require('axios')
const jwt = require('jsonwebtoken')

// РЕАЛЬНО РАБОЧЕЕ РЕШЕНИЕ для Medusa v2 Admin API
class WorkingMedusaAuth {
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

  // Получаем правильный JWT token для admin user
  async getCorrectJWTToken() {
    try {
      this.logger.info('🔐 Getting correct admin JWT token...')
      
      // Используем /auth/admin/emailpass для admin
      const response = await axios.post(`${this.medusaUrl}/auth/admin/emailpass`, {
        email: 'admin@medusa-test.com',
        password: 'supersecret'
      })

      const token = response.data.token
      
      // Decode token чтобы проверить структуру
      const decoded = jwt.decode(token)
      this.logger.info('JWT token structure:', {
        actor_type: decoded.actor_type,
        actor_id: decoded.actor_id,
        auth_identity_id: decoded.auth_identity_id
      })
      
      this.logger.success(`✅ JWT token obtained`)
      return token
      
    } catch (error) {
      this.logger.error('❌ JWT token failed:', error.response?.data?.message)
      throw error
    }
  }

  // Создаем session cookie вместо API key
  async createSessionCookie(jwtToken) {
    try {
      this.logger.info('🍪 Creating session cookie...')
      
      // Сначала создаем session через JWT
      const sessionResponse = await axios.post(`${this.medusaUrl}/auth/session`, {}, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })

      // Получаем cookie из response headers
      const cookies = sessionResponse.headers['set-cookie']
      const sessionCookie = cookies ? cookies[0] : null
      
      this.logger.success(`✅ Session cookie created`)
      return sessionCookie
      
    } catch (error) {
      this.logger.error('❌ Session creation failed:', error.response?.data?.message)
      throw error
    }
  }

  // Проверяем cookie authentication
  async testCookieAuth(sessionCookie) {
    try {
      this.logger.info('🧪 Testing cookie authentication...')
      
      const response = await axios.get(`${this.medusaUrl}/admin/products`, {
        headers: {
          'Cookie': sessionCookie
        }
      })

      this.logger.success(`✅ Cookie auth works! Found ${response.data.count} products`)
      return true
      
    } catch (error) {
      this.logger.error('❌ Cookie auth failed:', error.response?.data?.message)
      return false
    }
  }

  // Импортируем продукты используя cookie auth
  async importWithCookieAuth(sessionCookie) {
    try {
      this.logger.info('📦 Importing with cookie authentication...')
      
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
              'Cookie': sessionCookie,
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
          description: "Sexy red lace mini dress with matching G-string",
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
          description: "High-quality silicone vibrator with multiple modes",
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
              'Cookie': sessionCookie,
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
      this.logger.error('❌ Cookie import failed:', error.message)
      throw error
    }
  }

  // Главный метод с working решением
  async runWorkingSolution() {
    try {
      this.logger.info('🚀 Starting WORKING Medusa Auth Solution...')
      
      // Step 1: Получить правильный JWT token
      const jwtToken = await this.getCorrectJWTToken()
      
      // Step 2: Создать session cookie
      const sessionCookie = await this.createSessionCookie(jwtToken)
      
      if (!sessionCookie) {
        throw new Error('Failed to create session cookie')
      }
      
      // Step 3: Тестировать cookie auth
      const cookieWorks = await this.testCookieAuth(sessionCookie)
      if (!cookieWorks) {
        throw new Error('Cookie authentication failed')
      }
      
      // Step 4: Импортировать продукты
      const result = await this.importWithCookieAuth(sessionCookie)
      
      this.logger.success('\n🎉 WORKING Solution Success!')
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
      console.log(`   Cart: http://localhost:8001/cart`)
      
      return result
      
    } catch (error) {
      this.logger.error('❌ WORKING Solution failed:', error.message)
      throw error
    }
  }
}

// Запуск
async function runWorkingSolution() {
  const auth = new WorkingMedusaAuth()
  return await auth.runWorkingSolution()
}

runWorkingSolution().catch(console.error)

module.exports = { WorkingMedusaAuth, runWorkingSolution }
