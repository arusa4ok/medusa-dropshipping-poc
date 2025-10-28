const axios = require('axios')
const fs = require('fs')

class AdvancedProductImporter {
  constructor(medusaUrl, adminCredentials) {
    this.medusaUrl = medusaUrl
    this.adminCredentials = adminCredentials
    this.cookies = ''
    this.existingCategories = new Map()
    this.createdCategories = new Map()
    this.logger = {
      info: (...args) => console.log('ℹ️ ', ...args),
      success: (...args) => console.log('✅ ', ...args),
      warn: (...args) => console.log('⚠️ ', ...args),
      error: (...args) => console.log('❌ ', ...args)
    }
  }

  async authenticate() {
    try {
      this.logger.info('Authenticating with Medusa admin...')
      
      // Step 1: Get JWT token
      const authResponse = await axios.post(`${this.medusaUrl}/auth/admin/emailpass`, {
        email: this.adminCredentials.email,
        password: this.adminCredentials.password
      })

      const token = authResponse.data.token
      this.logger.info('✅ JWT token obtained')

      // Step 2: Create session with token
      const sessionResponse = await axios.post(
        `${this.medusaUrl}/auth/session`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      // Extract session cookie
      const setCookieHeader = sessionResponse.headers['set-cookie']
      if (setCookieHeader) {
        this.cookies = setCookieHeader.map(cookie => cookie.split(';')[0]).join('; ')
        this.logger.success('✅ Session established')
        return true
      }

      throw new Error('No session cookie received')
      
    } catch (error) {
      this.logger.error('Authentication failed:', error.response?.data?.message || error.message)
      return false
    }
  }

  async loadExistingCategories() {
    try {
      this.logger.info('Loading existing categories...')
      
      const response = await axios.get(`${this.medusaUrl}/admin/product-categories`, {
        headers: {
          'Cookie': this.cookies,
          'Content-Type': 'application/json'
        }
      })

      const categories = response.data.product_categories || []
      categories.forEach(category => {
        this.existingCategories.set(category.handle, {
          id: category.id,
          name: category.name,
          handle: category.handle
        })
      })

      this.logger.success(`✅ Loaded ${categories.length} existing categories`)
      
      // Log existing categories
      if (categories.length > 0) {
        this.logger.info('Existing categories:')
        this.existingCategories.forEach((cat, handle) => {
          this.logger.info(`  - ${handle}: ${cat.name}`)
        })
      }
      
    } catch (error) {
      this.logger.error('Failed to load existing categories:', error.response?.data?.message || error.message)
    }
  }

  async createCategory(categoryData) {
    // Check if category already exists
    if (this.existingCategories.has(categoryData.handle)) {
      this.logger.info(`Category "${categoryData.handle}" already exists, skipping creation`)
      return this.existingCategories.get(categoryData.handle)
    }

    // Check if we already created it in this session
    if (this.createdCategories.has(categoryData.handle)) {
      return this.createdCategories.get(categoryData.handle)
    }

    try {
      this.logger.info(`Creating category: ${categoryData.name}`)
      
      const response = await axios.post(
        `${this.medusaUrl}/admin/product-categories`,
        categoryData,
        {
          headers: {
            'Cookie': this.cookies,
            'Content-Type': 'application/json'
          }
        }
      )

      const createdCategory = {
        id: response.data.product_category.id,
        name: response.data.product_category.name,
        handle: response.data.product_category.handle
      }

      this.createdCategories.set(categoryData.handle, createdCategory)
      this.logger.success(`✅ Created category: ${createdCategory.name}`)
      
      return createdCategory
      
    } catch (error) {
      this.logger.error(`Failed to create category "${categoryData.name}":`, error.response?.data?.message || error.message)
      return null
    }
  }

  async getSalesChannelId() {
    try {
      const response = await axios.get(`${this.medusaUrl}/admin/sales-channels`, {
        headers: {
          'Cookie': this.cookies,
          'Content-Type': 'application/json'
        }
      })

      const channels = response.data.sales_channels || []
      if (channels.length > 0) {
        this.logger.success(`✅ Found sales channel: ${channels[0].name}`)
        return channels[0].id
      }

      // Create default sales channel if none exists
      this.logger.info('No sales channels found, creating default...')
      const createResponse = await axios.post(
        `${this.medusaUrl}/admin/sales-channels`,
        {
          name: "Default Sales Channel",
          description: "Created by import script"
        },
        {
          headers: {
            'Cookie': this.cookies,
            'Content-Type': 'application/json'
          }
        }
      )

      this.logger.success('✅ Created default sales channel')
      return createResponse.data.sales_channel.id
      
    } catch (error) {
      this.logger.error('Failed to get/create sales channel:', error.response?.data?.message || error.message)
      return null
    }
  }

  async createProduct(productData, categoryMap) {
    try {
      this.logger.info(`Creating product: ${productData.title}`)
      
      // Map category handle to category ID
      const categoryHandle = productData.categoryHandle || 'uncategorized'
      const category = this.getCategory(categoryHandle, categoryMap)
      
      // Prepare product payload for Medusa v2
      const payload = {
        title: productData.title,
        handle: productData.handle,
        description: productData.description,
        status: productData.status || 'draft',
        tags: productData.tags || [],
        options: productData.options || [{ title: "Default", values: ["Default"] }],
        variants: productData.variants || [{
          title: "Default",
          sku: productData.sku || `SKU_${Date.now()}`,
          prices: productData.prices || [{ currency_code: "USD", amount: 999 }],
          inventory_quantity: productData.inventory_quantity || 10,
          manage_inventory: true
        }],
        images: productData.images || [],
        metadata: productData.metadata || {}
      }

      // Add category if exists
      if (category) {
        payload.categories = [{ id: category.id }]
      }

      // Add sales channel if available
      const salesChannelId = await this.getSalesChannelId()
      if (salesChannelId) {
        payload.sales_channels = [{ id: salesChannelId }]
      }

      const response = await axios.post(
        `${this.medusaUrl}/admin/products`,
        payload,
        {
          headers: {
            'Cookie': this.cookies,
            'Content-Type': 'application/json'
          }
        }
      )

      this.logger.success(`✅ Created product: ${response.data.product.title}`)
      return response.data.product
      
    } catch (error) {
      this.logger.error(`Failed to create product "${productData.title}":`, error.response?.data?.message || error.message)
      return null
    }
  }

  getCategory(handle, categoryMap) {
    // Try to get from existing categories
    if (this.existingCategories.has(handle)) {
      return this.existingCategories.get(handle)
    }
    
    // Try to get from newly created categories
    if (this.createdCategories.has(handle)) {
      return this.createdCategories.get(handle)
    }
    
    // Try to get from provided category map
    if (categoryMap && categoryMap.has(handle)) {
      return categoryMap.get(handle)
    }
    
    return null
  }

  async importProducts(productsData, categoriesData) {
    try {
      this.logger.info('Starting advanced product import...')
      
      // Step 1: Authenticate
      const authSuccess = await this.authenticate()
      if (!authSuccess) {
        throw new Error('Authentication failed')
      }

      // Step 2: Load existing categories
      await this.loadExistingCategories()

      // Step 3: Create required categories
      this.logger.info('Creating categories...')
      const categoryMap = new Map()
      
      for (const categoryData of categoriesData) {
        const createdCategory = await this.createCategory(categoryData)
        if (createdCategory) {
          categoryMap.set(createdCategory.handle, createdCategory)
        }
      }

      // Step 4: Create products
      this.logger.info('Creating products...')
      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < productsData.length; i++) {
        const productData = productsData[i]
        
        this.logger.info(`Processing product ${i + 1}/${productsData.length}: ${productData.title}`)
        
        const createdProduct = await this.createProduct(productData, categoryMap)
        
        if (createdProduct) {
          successCount++
        } else {
          errorCount++
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const result = {
        successCount,
        errorCount,
        categoriesCreated: this.createdCategories.size,
        categoriesExisting: this.existingCategories.size
      }

      this.logger.success('🎉 Import completed!')
      this.logger.success(`✅ Products created: ${result.successCount}`)
      this.logger.success(`❌ Products failed: ${result.errorCount}`)
      this.logger.success(`📁 Categories created: ${result.categoriesCreated}`)
      this.logger.success(`📂 Categories existing: ${result.categoriesExisting}`)

      return result
      
    } catch (error) {
      this.logger.error('Import failed:', error.message)
      throw error
    }
  }

  async verifyImport() {
    try {
      this.logger.info('Verifying import...')
      
      // Check total products count
      const productsResponse = await axios.get(`${this.medusaUrl}/admin/products?limit=1000`, {
        headers: {
          'Cookie': this.cookies,
          'Content-Type': 'application/json'
        }
      })

      const productsCount = productsResponse.data.count || 0
      this.logger.success(`📦 Total products in admin: ${productsCount}`)

      // Check categories count
      const categoriesResponse = await axios.get(`${this.medusaUrl}/admin/product-categories?limit=1000`, {
        headers: {
          'Cookie': this.cookies,
          'Content-Type': 'application/json'
        }
      })

      const categoriesCount = categoriesResponse.data.product_categories?.length || 0
      this.logger.success(`📁 Total categories: ${categoriesCount}`)

      // Check store API
      const storeResponse = await axios.get(`${this.medusaUrl}/store/products`, {
        headers: {
          'x-publishable-api-key': 'pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953'
        }
      })

      const storeProductsCount = storeResponse.data.count || 0
      this.logger.success(`🛍️  Products visible in store: ${storeProductsCount}`)

      return {
        adminProducts: productsCount,
        adminCategories: categoriesCount,
        storeProducts: storeProductsCount
      }
      
    } catch (error) {
      this.logger.error('Verification failed:', error.response?.data?.message || error.message)
      return null
    }
  }
}

// Adult products data ready for import
const adultProducts = [
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

const adultCategories = [
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

async function runAdvancedImport() {
  console.log('🚀 Starting Advanced Product Import Module...')
  
  const importer = new AdvancedProductImporter(
    'http://localhost:9000',
    {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    }
  )

  try {
    // Run the import
    const result = await importer.importProducts(adultProducts, adultCategories)
    
    console.log('\n🎉 Import Summary:')
    console.log(`✅ Products created: ${result.successCount}`)
    console.log(`❌ Products failed: ${result.errorCount}`)
    console.log(`📁 Categories created: ${result.categoriesCreated}`)
    console.log(`📂 Categories existing: ${result.categoriesExisting}`)
    
    // Verify the import
    console.log('\n🔍 Verifying import...')
    await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for indexing
    
    const verification = await importer.verifyImport()
    
    if (verification) {
      console.log('\n📊 Final Results:')
      console.log(`📦 Admin products: ${verification.adminProducts}`)
      console.log(`📁 Admin categories: ${verification.adminCategories}`)
      console.log(`🛍️  Store products: ${verification.storeProducts}`)
    }
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: http://localhost:9000/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    console.log(`   Cart: http://localhost:8001/cart`)
    
  } catch (error) {
    console.error('❌ Advanced import failed:', error.message)
    process.exit(1)
  }
}

// Export for use as module
module.exports = { AdvancedProductImporter, runAdvancedImport }

// Run directly if called as script
if (require.main === module) {
  runAdvancedImport()
}
