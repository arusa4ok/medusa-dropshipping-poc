// Medusa v2 Container-based Seed Script for Adult Products
// Использует Medusa container вместо REST API

export default async function seedAdultProducts(container) {
  const logger = container.resolve("logger")
  const productModuleService = container.resolve("productModuleService")
  const salesChannelModuleService = container.resolve("salesChannelModuleService")
  const regionModuleService = container.resolve("regionModuleService")
  
  logger.info("Starting Adult Products Seed...")
  
  try {
    // Get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels()
    const defaultSalesChannel = salesChannels[0]
    
    if (!defaultSalesChannel) {
      logger.warn("No sales channel found, creating default...")
      await salesChannelModuleService.createSalesChannels({
        name: "Default Sales Channel",
        description: "Created by adult products seeding script",
      })
    }

    // Get or create region
    let regions = await regionModuleService.listRegions()
    if (regions.length === 0) {
      logger.info("Creating default region...")
      await regionModuleService.createRegions({
        name: "United States",
        currency_code: "usd",
      })
      regions = await regionModuleService.listRegions()
    }

    // Create adult categories
    logger.info("Creating adult categories...")
    const categories = [
      {
        name: "Lingerie & Intimate Apparel",
        handle: "lingerie",
        description: "Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400",
          adult_content: true
        }
      },
      {
        name: "Adult Toys & Vibrators",
        handle: "adult-toys", 
        description: "High-quality adult toys, vibrators, and intimate accessories from leading brands.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
          adult_content: true
        }
      },
      {
        name: "Couples & Gift Sets",
        handle: "couples-gifts",
        description: "Perfect products for couples including gift sets, advent calendars, and intimate accessories.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
          adult_content: true
        }
      },
      {
        name: "Adult Accessories & Essentials",
        handle: "adult-accessories",
        description: "Essential adult accessories including lubricants, cleaners, bondage gear, and care products.",
        metadata: { 
          image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400",
          adult_content: true
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
        // Category might already exist
        logger.warn(`⚠️  Category ${category.name} might already exist`)
        // Try to get existing category
        try {
          const existing = await productModuleService.listProductCategories({
            handle: category.handle
          })
          if (existing.length > 0) {
            createdCategories.push(existing[0])
            logger.info(`ℹ️  Using existing category: ${existing[0].name}`)
          }
        } catch (listError) {
          logger.error(`❌ Could not find existing category: ${category.name}`)
        }
      }
    }

    // Create category map for products
    const categoryMap = new Map()
    createdCategories.forEach(cat => {
      categoryMap.set(cat.handle, cat.id)
    })

    // Create adult products
    logger.info("Creating adult products...")
    
    const products = [
      {
        title: "Red Lace Mini Dress",
        handle: "red-lace-mini-dress",
        description: "Sexy red lace mini dress with matching G-string and adjustable straps. Perfect for intimate moments and roleplay.",
        status: "published",
        tags: [{ value: "Lingerie" }, { value: "Sexy" }, { value: "Roleplay" }],
        options: [{
          title: "Size",
          values: ["One Size"]
        }],
        variants: [{
          title: "One Size",
          sku: "DRESS_RED_001",
          prices: [{ currency_code: "usd", amount: 2799 }],
          inventory_quantity: 10,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
        }],
        metadata: {
          brand: "Leg Avenue",
          material: "Polyester",
          colour: "Red",
          adult_content: true,
          gender: "female",
          style: "Lingerie",
          occasion: "Intimate"
        }
      },
      {
        title: "Pink Silicone Vibrator",
        handle: "pink-silicone-vibrator",
        description: "High-quality silicone vibrator with multiple vibration modes. Waterproof and rechargeable for ultimate pleasure.",
        status: "published",
        tags: [{ value: "Adult Toy" }, { value: "Vibrator" }, { value: "Silicone" }],
        options: [{
          title: "Size",
          values: ["Standard"]
        }],
        variants: [{
          title: "Standard",
          sku: "VIBRATOR_PINK_001",
          prices: [{ currency_code: "usd", amount: 3999 }],
          inventory_quantity: 5,
          manage_inventory: true,
          allow_backorder: false
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
          waterproof: true,
          features: ["Multiple Vibration Modes", "Rechargeable", "Waterproof"]
        }
      },
      {
        title: "Black Lace Teddy",
        handle: "black-lace-teddy",
        description: "Elegant black lace teddy with intricate detailing and adjustable straps for perfect fit. Sophisticated and seductive.",
        status: "published",
        tags: [{ value: "Lingerie" }, { value: "Teddy" }, { value: "Black Lace" }],
        options: [{
          title: "Size",
          values: ["One Size"]
        }],
        variants: [{
          title: "One Size",
          sku: "TEDDY_BLACK_001",
          prices: [{ currency_code: "usd", amount: 3499 }],
          inventory_quantity: 7,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
        }],
        metadata: {
          brand: "Leg Avenue",
          material: "Lace",
          colour: "Black",
          adult_content: true,
          gender: "female",
          style: "Teddy",
          features: ["Adjustable Straps", "Intricate Detailing"]
        }
      },
      {
        title: "Rabbit Vibrator",
        handle: "rabbit-vibrator",
        description: "Dual stimulation rabbit vibrator with multiple speeds and patterns for intense pleasure. Made from body-safe materials.",
        status: "published",
        tags: [{ value: "Adult Toy" }, { value: "Rabbit Vibrator" }, { value: "Dual Stimulation" }],
        options: [{
          title: "Size",
          values: ["Standard"]
        }],
        variants: [{
          title: "Standard",
          sku: "RABBIT_VIB_001",
          prices: [{ currency_code: "usd", amount: 5999 }],
          inventory_quantity: 4,
          manage_inventory: true,
          allow_backorder: false
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
          waterproof: true,
          features: ["Dual Stimulation", "Multiple Speeds", "Body-Safe Material"]
        }
      },
      {
        title: "Couples Gift Set",
        handle: "couples-gift-set",
        description: "Perfect gift set for couples including massage oil, handcuffs, and other intimate accessories for exploring together.",
        status: "published",
        tags: [{ value: "Couples" }, { value: "Gift Set" }, { value: "Romantic" }],
        options: [{
          title: "Size",
          values: ["Complete Set"]
        }],
        variants: [{
          title: "Complete Set",
          sku: "COUPLES_SET_001",
          prices: [{ currency_code: "usd", amount: 4999 }],
          inventory_quantity: 8,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
        }],
        metadata: {
          brand: "Various",
          material: "Mixed",
          colour: "Assorted",
          adult_content: true,
          gender: "unisex",
          features: ["Massage Oil", "Handcuffs", "Intimate Accessories"]
        }
      },
      {
        title: "Bondage Starter Kit",
        handle: "bondage-starter-kit",
        description: "Perfect bondage starter kit with restraints, blindfold, and essential accessories for beginners exploring BDSM.",
        status: "published",
        tags: [{ value: "Accessories" }, { value: "Bondage" }, { value: "BDSM" }],
        options: [{
          title: "Size",
          values: ["Beginner Kit"]
        }],
        variants: [{
          title: "Beginner Kit",
          sku: "BONDAGE_KIT_001",
          prices: [{ currency_code: "usd", amount: 2999 }],
          inventory_quantity: 12,
          manage_inventory: true,
          allow_backorder: false
        }],
        images: [{
          url: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
        }],
        metadata: {
          brand: "Bondage Pro",
          material: "Mixed",
          colour: "Black",
          adult_content: true,
          gender: "unisex",
          features: ["Restraints", "Blindfold", "Beginner Friendly"]
        }
      }
    ]

    let successCount = 0
    
    for (const product of products) {
      try {
        logger.info(`Creating product: ${product.title}`)
        
        // Determine category based on tags
        let categoryHandle = "adult-accessories"
        if (product.tags.some(tag => tag.value === "Lingerie")) {
          categoryHandle = "lingerie"
        } else if (product.tags.some(tag => tag.value === "Adult Toy")) {
          categoryHandle = "adult-toys"
        } else if (product.tags.some(tag => tag.value === "Couples")) {
          categoryHandle = "couples-gifts"
        }
        
        const categoryId = categoryMap.get(categoryHandle)
        
        const productPayload = {
          ...product,
          ...(categoryId && { categories: [{ id: categoryId }] })
        }

        const createdProduct = await productModuleService.createProducts(productPayload)
        logger.info(`✅ Created product: ${createdProduct.title}`)
        successCount++
        
      } catch (error) {
        logger.error(`❌ Error creating product "${product.title}":`, error.message)
      }
    }

    logger.success(`🎉 Adult Products Seed Completed!`)
    logger.success(`✅ Products created: ${successCount}/${products.length}`)
    logger.success(`📁 Categories created/used: ${createdCategories.length}`)
    
    return {
      successCount,
      totalCount: products.length,
      categoriesCount: createdCategories.length
    }
    
  } catch (error) {
    logger.error("❌ Adult Products Seed Failed:", error)
    throw error
  }
}
