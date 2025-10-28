import { MedusaContainer } from "@medusajs/framework/types"
import { parseCSV } from "./csv-parser"

export default async function importProducts(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const productModuleService = container.resolve("productModuleService")
  const salesChannelModuleService = container.resolve("salesChannelModuleService")
  const regionModuleService = container.resolve("regionModuleService")

  logger.info("Starting product import...")

  try {
    // Parse CSV data
    const products = parseCSV()
    logger.info(`Parsed ${products.length} products from CSV`)

    // Create categories
    const categories = await createCategories(logger, productModuleService)
    logger.info(`Created ${categories.length} categories`)

    // Create sales channel
    const salesChannel = await salesChannelModuleService.createSalesChannels({
      name: "Adult Shop",
      description: "Adult products store"
    })
    logger.info(`Created sales channel: ${salesChannel.name}`)

    // Create products
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < Math.min(products.length, 10); i++) { // Start with 10 for testing
      const productData = products[i]
      
      try {
        logger.info(`Importing product ${i + 1}/${Math.min(products.length, 10)}: ${productData.title}`)
        
        const product = await productModuleService.createProducts(productData)
        logger.info(`✅ Created product: ${product.title}`)
        successCount++
        
      } catch (error) {
        logger.error(`❌ Error creating product ${productData.title}:`, error.message)
        errorCount++
      }
    }

    logger.info("Import completed!")
    logger.info(`✅ Successfully created: ${successCount} products`)
    logger.info(`❌ Failed to create: ${errorCount} products`)

  } catch (error) {
    logger.error("Import failed:", error)
    throw error
  }
}

async function createCategories(logger: any, productModuleService: any) {
  logger.info("Creating categories...")
  
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
      description: "High-quality adult toys, vibrators, and intimate accessories.",
      metadata: {
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
      }
    },
    {
      name: "Couples & Gift Sets",
      handle: "couples-gifts",
      description: "Perfect products for couples including gift sets and shared pleasure items.",
      metadata: {
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
      }
    },
    {
      name: "Adult Accessories & Essentials",
      handle: "adult-accessories",
      description: "Essential adult accessories including lubricants, cleaners, and care products.",
      metadata: {
        image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
      }
    }
  ]

  const createdCategories = []

  for (const category of categories) {
    try {
      const createdCategory = await productModuleService.createProductCategories(category)
      logger.info(`✅ Created category: ${createdCategory.name}`)
      createdCategories.push(createdCategory)
    } catch (error) {
      logger.error(`❌ Error creating category ${category.name}:`, error.message)
    }
  }

  return createdCategories
}
