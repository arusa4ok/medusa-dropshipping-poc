const puppeteer = require('puppeteer')
const fs = require('fs')

class BrowserProductImporter {
  constructor(medusaUrl, adminCredentials) {
    this.medusaUrl = medusaUrl
    this.adminCredentials = adminCredentials
    this.logger = {
      info: (...args) => console.log('ℹ️ ', ...args),
      success: (...args) => console.log('✅ ', ...args),
      warn: (...args) => console.log('⚠️ ', ...args),
      error: (...args) => console.log('❌ ', ...args)
    }
  }

  async createCategoriesAndProducts() {
    let browser
    try {
      this.logger.info('Starting browser-based product import...')
      
      browser = await puppeteer.launch({ 
        headless: false, // Set to false for debugging
        defaultViewport: { width: 1280, height: 800 }
      })
      
      const page = await browser.newPage()

      // Navigate to admin
      this.logger.info('Navigating to admin panel...')
      await page.goto(`${this.medusaUrl}/app`)

      // Wait for login page
      await page.waitForSelector('input[type="email"]', { timeout: 10000 })

      // Login
      this.logger.info('Logging in...')
      await page.type('input[type="email"]', this.adminCredentials.email)
      await page.type('input[type="password"]', this.adminCredentials.password)
      await page.click('button[type="submit"]')

      // Wait for dashboard
      await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 })
      this.logger.success('✅ Logged in successfully')

      // Navigate to products
      await page.click('[data-testid="products-nav"]')
      await page.waitForSelector('[data-testid="products-list"]', { timeout: 10000 })

      // Create categories first
      await this.createCategoriesInUI(page)

      // Then create products
      await this.createProductsInUI(page)

      this.logger.success('🎉 Browser import completed!')
      
    } catch (error) {
      this.logger.error('Browser import failed:', error.message)
      throw error
    } finally {
      if (browser) {
        // Keep browser open for manual verification
        this.logger.info('Browser kept open for manual verification...')
        // await browser.close()
      }
    }
  }

  async createCategoriesInUI(page) {
    this.logger.info('Creating categories in UI...')
    
    const categories = [
      { name: "Lingerie & Intimate Apparel", handle: "lingerie" },
      { name: "Adult Toys & Vibrators", handle: "adult-toys" },
      { name: "Couples & Gift Sets", handle: "couples-gifts" },
      { name: "Adult Accessories & Essentials", handle: "adult-accessories" }
    ]

    for (const category of categories) {
      try {
        this.logger.info(`Creating category: ${category.name}`)
        
        // Navigate to categories
        await page.click('[data-testid="categories-nav"]')
        await page.waitForSelector('[data-testid="categories-list"]', { timeout: 5000 })
        
        // Create new category
        await page.click('[data-testid="create-category-button"]')
        await page.waitForSelector('[data-testid="category-form"]', { timeout: 5000 })
        
        // Fill category form
        await page.type('[data-testid="category-name"]', category.name)
        await page.type('[data-testid="category-handle"]', category.handle)
        await page.type('[data-testid="category-description"]', `Products for ${category.name}`)
        
        // Save category
        await page.click('[data-testid="save-category-button"]')
        await page.waitForSelector('[data-testid="category-saved"]', { timeout: 5000 })
        
        this.logger.success(`✅ Created category: ${category.name}`)
        
      } catch (error) {
        this.logger.warn(`⚠️  Category creation failed: ${category.name}`, error.message)
      }
    }
  }

  async createProductsInUI(page) {
    this.logger.info('Creating products in UI...')
    
    // Read product data
    const csvContent = fs.readFileSync('./adult-products.csv', 'utf8')
    const lines = csvContent.split('\n').slice(1) // Skip header
    const products = lines.map(line => {
      const fields = line.split(',')
      return {
        handle: fields[0],
        title: fields[1],
        description: fields[2],
        categoryHandle: fields[5]
      }
    }).filter(p => p.handle)

    for (let i = 0; i < Math.min(products.length, 3); i++) { // Limit to 3 for testing
      const product = products[i]
      
      try {
        this.logger.info(`Creating product ${i + 1}: ${product.title}`)
        
        // Navigate to products
        await page.click('[data-testid="products-nav"]')
        await page.waitForSelector('[data-testid="products-list"]', { timeout: 5000 })
        
        // Create new product
        await page.click('[data-testid="create-product-button"]')
        await page.waitForSelector('[data-testid="product-form"]', { timeout: 5000 })
        
        // Fill product form
        await page.type('[data-testid="product-title"]', product.title)
        await page.type('[data-testid="product-handle"]', product.handle)
        await page.type('[data-testid="product-description"]', product.description)
        
        // Select category
        await page.click('[data-testid="category-selector"]')
        await page.waitForSelector('[data-testid="category-options"]', { timeout: 3000 })
        await page.click(`[data-testid="category-${product.categoryHandle}"]`)
        
        // Add variant
        await page.click('[data-testid="add-variant-button"]')
        await page.waitForSelector('[data-testid="variant-form"]', { timeout: 3000 })
        await page.type('[data-testid="variant-sku"]', `SKU_${product.handle.toUpperCase()}`)
        await page.type('[data-testid="variant-price"]', '29.99')
        
        // Save product
        await page.click('[data-testid="save-product-button"]')
        await page.waitForSelector('[data-testid="product-saved"]', { timeout: 5000 })
        
        this.logger.success(`✅ Created product: ${product.title}`)
        
      } catch (error) {
        this.logger.warn(`⚠️  Product creation failed: ${product.title}`, error.message)
      }
    }
  }
}

// Run browser import
async function runBrowserImport() {
  console.log('🌐 Starting Browser-Based Import...')
  
  const importer = new BrowserProductImporter(
    'http://localhost:9000',
    {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    }
  )

  try {
    await importer.createCategoriesAndProducts()
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: http://localhost:9000/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    
  } catch (error) {
    console.error('❌ Browser import failed:', error.message)
    process.exit(1)
  }
}

module.exports = { BrowserProductImporter, runBrowserImport }

if (require.main === module) {
  runBrowserImport()
}
