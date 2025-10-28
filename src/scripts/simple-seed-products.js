const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Create a temporary seed script that uses container-based approach
const seedScript = `
import { MedusaContainer } from "@medusajs/framework/types"

const adultProducts = [
  {
    title: "Red Lace Mini Dress",
    handle: "red-lace-mini-dress",
    description: "Sexy red lace mini dress with matching G-string and adjustable straps. Perfect for intimate moments and roleplay.",
    status: "published" as const,
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "DRESS_RED_001",
      prices: [{ currency_code: "USD" as const, amount: 2799 }],
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
    status: "published" as const,
    tags: [{ value: "Adult Toy" }],
    options: [{ title: "Size", values: ["Standard"] }],
    variants: [{
      title: "Default",
      sku: "VIBRATOR_PINK_001",
      prices: [{ currency_code: "USD" as const, amount: 3999 }],
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
    status: "published" as const,
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "TEDDY_BLACK_001",
      prices: [{ currency_code: "USD" as const, amount: 3499 }],
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
    title: "Couples Gift Set",
    handle: "couples-gift-set",
    description: "Perfect gift set for couples including massage oil, handcuffs, and other intimate accessories.",
    status: "published" as const,
    tags: [{ value: "Couples" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "COUPLES_SET_001",
      prices: [{ currency_code: "USD" as const, amount: 4999 }],
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
  }
]

export default async function seedAdultProducts(container) {
  const logger = { info: console.log, error: console.error, warn: console.warn }
  
  try {
    const productModuleService = container.productModuleService
    
    if (!productModuleService) {
      logger.error("❌ productModuleService not found in container")
      return
    }

    logger.info("Creating adult products...")

    // Create categories first
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

    const createdCategories = []
    for (const category of categories) {
      try {
        const createdCategory = await productModuleService.createProductCategories(category)
        logger.info(\`✅ Created category: \${createdCategory.name}\`)
        createdCategories.push(createdCategory)
      } catch (error) {
        logger.error(\`❌ Error creating category \${category.name}:\`, error.message)
      }
    }

    // Create products with categories
    const categoryMap = new Map()
    createdCategories.forEach(cat => {
      categoryMap.set(cat.handle, cat.id)
    })

    let successCount = 0
    for (const product of adultProducts) {
      try {
        logger.info(\`Creating product: \${product.title}\`)
        
        // Add category
        let productData = { ...product }
        if (product.handle === 'red-lace-mini-dress' && categoryMap.has('lingerie')) {
          productData.categories = [{ id: categoryMap.get('lingerie') }]
        } else if (product.handle === 'pink-silicone-vibrator' && categoryMap.has('adult-toys')) {
          productData.categories = [{ id: categoryMap.get('adult-toys') }]
        } else if (product.handle === 'black-lace-teddy' && categoryMap.has('lingerie')) {
          productData.categories = [{ id: categoryMap.get('lingerie') }]
        } else if (product.handle === 'couples-gift-set' && categoryMap.has('adult-toys')) {
          productData.categories = [{ id: categoryMap.get('adult-toys') }]
        }
        
        await productModuleService.createProducts(productData)
        logger.info(\`✅ Created product: \${product.title}\`)
        successCount++
      } catch (error) {
        logger.error(\`❌ Error creating product \${product.title}:\`, error.message)
      }
    }
    
    logger.info("✅ Adult products seed completed!")
    logger.info(\`📁 Created: \${createdCategories.length} categories\`)
    logger.info(\`📦 Created: \${successCount} adult products\`)
  } catch (error) {
    logger.error("❌ Adult products seed failed:", error)
    throw error
  }
}
`

// Write the temporary seed script
const tempScriptPath = './src/scripts/temp-adult-seed.ts'
fs.writeFileSync(tempScriptPath, seedScript)

console.log('🚀 Starting adult products import...')

try {
  // Execute the seed script
  execSync(`npx medusa exec ${tempScriptPath}`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  console.log('\n🎉 Import completed!')
  console.log('🌐 You can now visit:')
  console.log('   Storefront: http://localhost:8001/products')
  console.log('   Cart: http://localhost:8001/cart')
  
} catch (error) {
  console.error('❌ Import failed:', error.message)
  process.exit(1)
} finally {
  // Clean up temporary file
  if (fs.existsSync(tempScriptPath)) {
    fs.unlinkSync(tempScriptPath)
  }
}
