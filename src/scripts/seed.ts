import { MedusaContainer } from "@medusajs/framework/types"

const products = [
  { title: 'Cotton Bedsheets', description: 'Soft cotton bedsheets set', handle: 'cotton-bedsheets', price: 4999 },
  { title: 'Memory Foam Pillow', description: 'Ergonomic memory foam pillow', handle: 'memory-pillow', price: 2999 },
  { title: 'Wall Clock', description: 'Modern wall clock', handle: 'wall-clock', price: 1999 },
  { title: 'Table Lamp', description: 'Decorative table lamp', handle: 'table-lamp', price: 3999 },
  { title: 'Throw Blanket', description: 'Cozy throw blanket', handle: 'throw-blanket', price: 2499 },
  { title: 'Face Cream', description: 'Moisturizing face cream', handle: 'face-cream', price: 2999 },
  { title: 'Shampoo Set', description: 'Natural hair care set', handle: 'shampoo-set', price: 1999 },
  { title: 'Yoga Mat', description: 'Non-slip yoga mat', handle: 'yoga-mat', price: 2999 },
  { title: 'Dumbbells Set', description: '5kg dumbbells pair', handle: 'dumbbells', price: 4999 },
  { title: 'Fiction Novel', description: 'Bestselling fiction book', handle: 'fiction-novel', price: 1499 },
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

    // Create products
    logger.info(`Creating ${products.length} products...`)
    
    for (const productData of products) {
      try {
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
