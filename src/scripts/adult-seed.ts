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
  },
  {
    title: "Adult Essentials Kit",
    handle: "adult-essentials-kit",
    description: "Complete adult essentials kit including lubricants, cleaners, and care products.",
    status: "published" as const,
    tags: [{ value: "Accessories" }],
    options: [{ title: "Size", values: ["Standard"] }],
    variants: [{
      title: "Default",
      sku: "ESSENTIALS_KIT_001",
      prices: [{ currency_code: "USD" as const, amount: 1999 }],
      inventory_quantity: 15,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
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

export default async function seedAdultProducts(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const productModuleService = container.resolve("productModuleService")

  logger.info("Starting adult products seed...")

  try {
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
      },
      {
        name: "Couples & Gift Sets",
        handle: "couples-gifts",
        description: "Perfect products for couples including gift sets",
        metadata: { image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400" }
      },
      {
        name: "Adult Accessories & Essentials",
        handle: "adult-accessories",
        description: "Essential adult accessories and care products",
        metadata: { image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400" }
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

    // Create products with categories
    logger.info(`Creating ${adultProducts.length} adult products...`)
    
    const categoryMap = new Map()
    createdCategories.forEach(cat => {
      categoryMap.set(cat.handle, cat.id)
    })

    for (const product of adultProducts) {
      try {
        logger.info(`Creating product: ${product.title}`)
        
        // Add category
        let productData = { ...product }
        if (product.handle === 'red-lace-mini-dress' && categoryMap.has('lingerie')) {
          productData.categories = [{ id: categoryMap.get('lingerie') }]
        } else if (product.handle === 'pink-silicone-vibrator' && categoryMap.has('adult-toys')) {
          productData.categories = [{ id: categoryMap.get('adult-toys') }]
        } else if (product.handle === 'couples-gift-set' && categoryMap.has('couples-gifts')) {
          productData.categories = [{ id: categoryMap.get('couples-gifts') }]
        } else if (product.handle === 'adult-essentials-kit' && categoryMap.has('adult-accessories')) {
          productData.categories = [{ id: categoryMap.get('adult-accessories') }]
        }
        
        await productModuleService.createProducts(productData)
        logger.info(`✅ Created product: ${product.title}`)
      } catch (error) {
        logger.error(`❌ Error creating product ${product.title}:`, error.message)
      }
    }
    
    logger.info("✅ Adult products seed completed successfully!")
    logger.info(`📁 Created: ${createdCategories.length} categories`)
    logger.info(`📦 Created: ${adultProducts.length} adult products`)
  } catch (error) {
    logger.error("❌ Adult products seed failed:", error)
    throw error
  }
}
