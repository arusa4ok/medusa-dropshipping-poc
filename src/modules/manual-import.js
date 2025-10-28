const axios = require('axios')
const fs = require('fs')

class ManualProductImporter {
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

  async testAuthentication() {
    this.logger.info('Testing authentication methods...')
    
    const methods = [
      { name: 'JWT Bearer token', headers: { 'Authorization': `Bearer ${this.getJWTToken()}` }},
      { name: 'x-medusa-access-token', headers: { 'x-medusa-access-token': this.getJWTToken() }},
    ]

    for (const method of methods) {
      try {
        const response = await axios.get(`${this.medusaUrl}/admin/products`, {
          headers: method.headers,
          timeout: 5000
        })
        
        this.logger.success(`✅ ${method.name} - Status: ${response.status}, Products: ${response.data.count || 0}`)
        return method.headers
        
      } catch (error) {
        this.logger.warn(`⚠️  ${method.name} failed: ${error.response?.status}`)
      }
    }

    return null
  }

  getJWTToken() {
    try {
      // Try to get fresh token
      const response = axios.post(`${this.medusaUrl}/auth/admin/emailpass`, this.adminCredentials)
      return response.data.token
    } catch (error) {
      // Use hardcoded token for now
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6IiIsImFjdG9yX3R5cGUiOiJhZG1pbiIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLOEpYVkUzVjZWQ1dXWk03S0tRSFRDVkMiLCJhcHBfbWV0YWRhdGEiOnt9LCJ1c2VyX21ldGFkYXRhIjp7fSwiaWF0IjoxNzYxNjM0NTE2LCJleHAiOjE3NjE3MjA5MTZ9.XVSAI9_qs22mdfijwfnbN2FFPgk78sMS-E52evOdJZU'
    }
  }

  async createCategory(categoryData, headers) {
    try {
      this.logger.info(`Creating category: ${categoryData.name}`)
      
      const response = await axios.post(
        `${this.medusaUrl}/admin/product-categories`,
        categoryData,
        { headers }
      )

      this.logger.success(`✅ Created category: ${response.data.product_category.name}`)
      return {
        id: response.data.product_category.id,
        name: response.data.product_category.name,
        handle: response.data.product_category.handle
      }
      
    } catch (error) {
      this.logger.error(`❌ Failed to create category:`, error.response?.data?.message || error.message)
      return null
    }
  }

  async createProduct(productData, categoryId, headers) {
    try {
      this.logger.info(`Creating product: ${productData.title}`)
      
      const payload = {
        title: productData.title,
        handle: productData.handle,
        description: productData.description,
        status: "published",
        tags: productData.tags || [],
        options: productData.options || [{ title: "Size", values: ["One Size"] }],
        variants: productData.variants || [{
          title: "Default",
          sku: `SKU_${productData.handle.toUpperCase()}`,
          prices: [{ currency_code: "USD", amount: 2999 }],
          inventory_quantity: 10,
          manage_inventory: true
        }],
        images: productData.images || [],
        metadata: productData.metadata || {},
        ...(categoryId && { categories: [{ id: categoryId }] })
      }

      const response = await axios.post(
        `${this.medusaUrl}/admin/products`,
        payload,
        { headers }
      )

      this.logger.success(`✅ Created product: ${response.data.product.title}`)
      return response.data.product
      
    } catch (error) {
      this.logger.error(`❌ Failed to create product:`, error.response?.data?.message || error.message)
      return null
    }
  }

  async runManualImport() {
    try {
      this.logger.info('🚀 Starting Manual Product Import...')

      // Test authentication
      const headers = await this.testAuthentication()
      if (!headers) {
        this.logger.error('❌ No working authentication method found')
        return
      }

      // Load product data
      const csvContent = fs.readFileSync('./adult-products.csv', 'utf8')
      const lines = csvContent.split('\n').slice(1) // Skip header
      const products = this.parseCSV(lines)

      // Define categories
      const categories = [
        {
          name: "Lingerie & Intimate Apparel",
          handle: "lingerie",
          description: "Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes.",
          metadata: { image: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400" }
        },
        {
          name: "Adult Toys & Vibrators",
          handle: "adult-toys",
          description: "High-quality adult toys, vibrators, and intimate accessories from leading brands.",
          metadata: { image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400" }
        },
        {
          name: "Couples & Gift Sets",
          handle: "couples-gifts",
          description: "Perfect products for couples including gift sets, advent calendars, and intimate accessories.",
          metadata: { image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400" }
        },
        {
          name: "Adult Accessories & Essentials",
          handle: "adult-accessories",
          description: "Essential adult accessories including lubricants, cleaners, bondage gear, and care products.",
          metadata: { image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400" }
        }
      ]

      // Create categories
      this.logger.info('📁 Creating categories...')
      const categoryMap = new Map()

      for (const categoryData of categories) {
        const createdCategory = await this.createCategory(categoryData, headers)
        if (createdCategory) {
          categoryMap.set(createdCategory.handle, createdCategory)
        }
      }

      // Create products
      this.logger.info('📦 Creating products...')
      let successCount = 0

      for (const product of products) {
        const categoryId = categoryMap.get(product.categoryHandle)
        const createdProduct = await this.createProduct(product, categoryId, headers)
        
        if (createdProduct) {
          successCount++
        }

        // Add delay
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      this.logger.success('🎉 Manual import completed!')
      this.logger.success(`✅ Products created: ${successCount}/${products.length}`)
      this.logger.success(`📁 Categories created: ${categoryMap.size}`)

      // Verify import
      await this.verifyImport()

      console.log('\n🌐 You can now visit:')
      console.log(`   Admin: ${this.medusaUrl}/app`)
      console.log(`   Storefront: http://localhost:8001/products`)
      
    } catch (error) {
      this.logger.error('❌ Manual import failed:', error.message)
      throw error
    }
  }

  parseCSV(lines) {
    return lines
      .filter(line => line.trim())
      .map(line => {
        const fields = this.parseCSVLine(line)
        return {
          handle: fields[0],
          title: fields[1].replace(/"/g, ''),
          description: fields[2].replace(/"/g, ''),
          status: fields[3],
          tags: fields[4] ? [{ value: fields[4].replace(/"/g, '') }] : [],
          categoryHandle: fields[5],
          variants: [{
            title: fields[7] || 'Default',
            sku: fields[6],
            prices: [{ currency_code: "USD", amount: parseFloat(fields[8]) * 100 }],
            inventory_quantity: parseInt(fields[9]) || 10,
            manage_inventory: true
          }],
          images: fields[10] ? [{ url: fields[10].replace(/"/g, '') }] : [],
          metadata: {
            brand: fields[11]?.replace(/"/g, ''),
            material: fields[12]?.replace(/"/g, ''),
            colour: fields[13]?.replace(/"/g, ''),
            adult_content: fields[14] === 'true'
          }
        }
      })
  }

  parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  async verifyImport() {
    try {
      this.logger.info('🔍 Verifying import...')
      
      // Check store API
      const storeResponse = await axios.get(`${this.medusaUrl}/store/products`, {
        headers: {
          'x-publishable-api-key': this.publishableKey
        }
      })

      const productsCount = storeResponse.data.count || 0
      this.logger.success(`📦 Products visible in store: ${productsCount}`)

      // List a few products
      const products = storeResponse.data.products || []
      products.slice(0, 5).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} (${product.handle})`)
      })
      
    } catch (error) {
      this.logger.error('❌ Verification failed:', error.message)
    }
  }
}

async function runManualImport() {
  const importer = new ManualProductImporter()
  await importer.runManualImport()
}

module.exports = { ManualProductImporter, runManualImport }

if (require.main === module) {
  runManualImport()
}
