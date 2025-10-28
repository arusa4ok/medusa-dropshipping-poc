import { MedusaContainer } from "@medusajs/framework/types"

const products = [
  {
    title: "Red Lace Mini Dress",
    handle: "red-lace-mini-dress", 
    description: "Sexy red lace mini dress with matching G-string",
    subtitle: "Leg Avenue • Polyester",
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
    description: "High-quality silicone vibrator with multiple vibration modes", 
    subtitle: "DreamToys • Silicone",
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
  { title: 'Cotton Bedsheets', description: 'Soft cotton bedsheets set', handle: 'cotton-bedsheets', price: 4999 },
  { title: 'Memory Foam Pillow', description: 'Ergonomic memory foam pillow', handle: 'memory-pillow', price: 2999 },
  { title: 'Wall Clock', description: 'Modern wall clock', handle: 'wall-clock', price: 1999 },
  { title: 'Table Lamp', description: 'Decorative table lamp', handle: 'table-lamp', price: 3999 },
  { title: 'Throw Blanket', description: 'Cozy throw blanket', handle: 'throw-blanket', price: 2499 },
  { title: 'Face Cream', description: 'Moisturizing face cream', handle: 'face-cream', price: 2999 },
  { title: 'Shampoo Set', description: 'Natural hair care set', handle: 'shampoo-set', price: 1999 },
  { title: 'Yoga Mat', description: 'Non-slip yoga mat', handle: 'yoga-mat', price: 2999 },
]

export default async function seedDemoData(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const productModuleService = container.resolve("productModuleService")
  const salesChannelModuleService = container.resolve("salesChannelModuleService")
  const regionModuleService = container.resolve("regionModuleService")
  
  logger.info("Starting seed...")
  
  try {
    // Get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels()
    const defaultSalesChannel = salesChannels[0]
    
    if (!defaultSalesChannel) {
      logger.warn("No sales channel found, creating default...")
      await salesChannelModuleService.createSalesChannels({
        name: "Default Sales Channel",
        description: "Created by seeding script",
      })
    }

    // Get or create region
    let regions = await regionModuleService.listRegions()
    if (regions.length === 0) {
      logger.info("Creating default region...")
      await regionModuleService.createRegions({
        name: "Russia",
        currency_code: "rub",
      })
      regions = await regionModuleService.listRegions()
    }

    // Create categories
    logger.info("Creating adult categories...")
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
        logger.info(`✅ Created category: ${createdCategory.name}`)
        createdCategories.push(createdCategory)
      } catch (error) {
        logger.error(`❌ Error creating category:`, error)
      }
    }

    // Create products with categories
    logger.info(`Creating ${products.length} products...`)
    
    const categoryMap = new Map()
    createdCategories.forEach(cat => {
      categoryMap.set(cat.handle, cat.id)
    })

    for (const product of products) {
      try {
        logger.info(`Creating product: ${product.title}`)
        
        // Add category for adult products
        let productData = { ...product }
        if (product.handle === 'red-lace-mini-dress' && categoryMap.has('lingerie')) {
          productData.categories = [{ id: categoryMap.get('lingerie') }]
        } else if (product.handle === 'pink-silicone-vibrator' && categoryMap.has('adult-toys')) {
          productData.categories = [{ id: categoryMap.get('adult-toys') }]
        }
        
        await productModuleService.createProducts({
          title: productData.title,
          description: productData.description,
          handle: productData.handle,
          status: "published",
          options: [
            {
              title: "Default Option",
              values: ["Default"],
            },
          ],
          variants: [
            {
              title: "Default",
              options: {
                "Default Option": "Default",
              },
              prices: [
                {
                  amount: productData.price,
                  currency_code: "rub",
                },
              ],
            },
          ],
        })
        logger.info(`✓ Created product: ${productData.title}`)
      } catch (error) {
        logger.error(`✗ Failed to create product ${productData.title}:`, error)
      }
    }
    
    logger.info("Seeding completed successfully!")
    logger.info("You can now login with: admin@medusa-test.com / supersecret")
  } catch (error) {
    logger.error("Error seeding data:", error)
    throw error
  }
}
