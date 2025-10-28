const axios = require('axios')

// DEFINITIVE WORKING SOLUTION - Medusa v2 Admin API
class DefinitiveMedusaImport {
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

  async runDefinitiveImport() {
    try {
      this.logger.info('🚀 Starting DEFINITIVE Medusa Import...')
      
      // Ждем пока backend перезапустится с middleware
      await this.waitForBackend()
      
      // Step 1: Test authentication methods
      await this.testAuthMethods()
      
      // Step 2: Выбираем рабочий method и импортируем
      const result = await this.importWithWorkingAuth()
      
      this.logger.success('\n🎉 DEFINITIVE Import Success!')
      this.logger.success(`✅ Products created: ${result.productsCreated}`)
      this.logger.success(`📁 Categories created: ${result.categoriesCreated}`)
      
      return result
      
    } catch (error) {
      this.logger.error('❌ DEFINITIVE Import failed:', error.message)
      throw error
    }
  }

  async waitForBackend() {
    this.logger.info('⏳ Waiting for backend restart...')
    let retries = 10
    
    while (retries > 0) {
      try {
        await axios.get(`${this.medusaUrl}/health`)
        this.logger.success('✅ Backend is ready!')
        return
      } catch (error) {
        retries--
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    throw new Error('Backend not ready after restart')
  }

  async testAuthMethods() {
    this.logger.info('🧪 Testing authentication methods...')
    
    // Method 1: JWT Bearer token
    try {
      const jwtToken = await this.getJWTToken()
      const jwtWorks = await this.testJWTAuth(jwtToken)
      if (jwtWorks) {
        this.logger.success('✅ JWT Bearer authentication works!')
        this.authMethod = 'jwt'
        this.authToken = jwtToken
        return
      }
    } catch (error) {
      this.logger.warn('⚠️  JWT auth failed:', error.message)
    }
    
    // Method 2: Secret API Key (Basic auth)
    try {
      const secretToken = await this.createSecretAPIKey()
      const basicWorks = await this.testBasicAuth(secretToken)
      if (basicWorks) {
        this.logger.success('✅ Basic auth with API key works!')
        this.authMethod = 'basic'
        this.authToken = secretToken
        return
      }
    } catch (error) {
      this.logger.warn('⚠️  Basic auth failed:', error.message)
    }
    
    // Method 3: Session cookie
    try {
      const sessionCookie = await this.createSessionCookie()
      const cookieWorks = await this.testCookieAuth(sessionCookie)
      if (cookieWorks) {
        this.logger.success('✅ Session cookie authentication works!')
        this.authMethod = 'cookie'
        this.authToken = sessionCookie
        return
      }
    } catch (error) {
      this.logger.warn('⚠️  Cookie auth failed:', error.message)
    }
    
    throw new Error('No authentication method works!')
  }

  async getJWTToken() {
    const response = await axios.post(`${this.medusaUrl}/auth/admin/emailpass`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    })
    return response.data.token
  }

  async testJWTAuth(token) {
    try {
      await axios.get(`${this.medusaUrl}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return true
    } catch (error) {
      return false
    }
  }

  async createSecretAPIKey() {
    const jwtToken = await this.getJWTToken()
    const response = await axios.post(`${this.medusaUrl}/admin/api-keys`, {
      title: "Definitive Import Key",
      type: "secret"
    }, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data.api_key.token
  }

  async testBasicAuth(secretToken) {
    try {
      await axios.get(`${this.medusaUrl}/admin/products`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`
        }
      })
      return true
    } catch (error) {
      return false
    }
  }

  async createSessionCookie() {
    const jwtToken = await this.getJWTToken()
    const response = await axios.post(`${this.medusaUrl}/auth/session`, {}, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    })
    return response.headers['set-cookie']?.[0]
  }

  async testCookieAuth(cookie) {
    try {
      await axios.get(`${this.medusaUrl}/admin/products`, {
        headers: {
          'Cookie': cookie
        }
      })
      return true
    } catch (error) {
      return false
    }
  }

  async importWithWorkingAuth() {
    this.logger.info(`📦 Importing using ${this.authMethod} authentication...`)
    
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
        const response = await this.makeAuthenticatedRequest('/admin/product-categories', 'POST', category)
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

    let productsCreated = 0
    
    for (const product of products) {
      try {
        this.logger.info(`Creating product: ${product.title}`)
        
        const category = categoryMap.get(product.categoryHandle)
        const payload = {
          ...product,
          ...(category && { categories: [{ id: category.id }] })
        }

        const response = await this.makeAuthenticatedRequest('/admin/products', 'POST', payload)
        this.logger.success(`✅ Product created: ${response.data.product.title}`)
        productsCreated++
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        this.logger.error(`❌ Product "${product.title}" failed:`, error.response?.data?.message)
      }
    }

    return {
      productsCreated,
      categoriesCreated: categoryMap.size
    }
  }

  async makeAuthenticatedRequest(endpoint, method, data) {
    const headers = this.getAuthHeaders()
    
    return await axios({
      method,
      url: `${this.medusaUrl}${endpoint}`,
      data,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    })
  }

  getAuthHeaders() {
    switch (this.authMethod) {
      case 'jwt':
        return { 'Authorization': `Bearer ${this.authToken}` }
      case 'basic':
        return { 'Authorization': `Basic ${Buffer.from(`${this.authToken}:`).toString('base64')}` }
      case 'cookie':
        return { 'Cookie': this.authToken }
      default:
        throw new Error('No auth method available')
    }
  }
}

// Запуск
async function runDefinitiveImport() {
  const importer = new DefinitiveMedusaImport()
  return await importer.runDefinitiveImport()
}

runDefinitiveImport().catch(console.error)

module.exports = { DefinitiveMedusaImport, runDefinitiveImport }
