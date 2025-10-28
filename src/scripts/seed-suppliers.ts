import { MedusaContainer } from "@medusajs/framework/types"

const suppliers = [
  {
    name: "AdultToys Warehouse EU",
    priority: 1, // Highest priority
    cut_off_time: "14:00:00",
    shipping_cost_base: 599, // $5.99
    is_active: true,
    metadata: {
      region: "EU",
      specialization: "adult toys",
      same_day_delivery: true
    }
  },
  {
    name: "Lingerie Direct",
    priority: 2,
    cut_off_time: "16:00:00", 
    shipping_cost_base: 499, // $4.99
    is_active: true,
    metadata: {
      region: "EU",
      specialization: "lingerie",
      same_day_delivery: false
    }
  },
  {
    name: "Global Adult Supply",
    priority: 3,
    cut_off_time: "12:00:00",
    shipping_cost_base: 899, // $8.99
    is_active: true,
    metadata: {
      region: "Global",
      specialization: "mixed",
      same_day_delivery: false
    }
  }
]

const productMappings = [
  // Red Lace Mini Dress
  {
    product_id: "prod_lingerie_001",
    supplier_id: "supplier_lingerie_001", // Will be mapped after creation
    supplier_sku: "DRESS_RED_M",
    cost_price: 1299, // $12.99
    stock_quantity: 50,
    lead_time_days: 2,
    priority_override: 1 // High priority for this specific product
  },
  // Pink Silicone Vibrator  
  {
    product_id: "prod_adult_toy_001",
    supplier_id: "supplier_adult_001", // Will be mapped after creation
    supplier_sku: "VIBR_PINK_STD",
    cost_price: 1899, // $18.99
    stock_quantity: 30,
    lead_time_days: 3,
    priority_override: null // Use supplier default priority
  },
  // Black Lace Teddy
  {
    product_id: "prod_lingerie_002", 
    supplier_id: "supplier_lingerie_001",
    supplier_sku: "TEDDY_BLK_OS",
    cost_price: 1599, // $15.99
    stock_quantity: 25,
    lead_time_days: 2,
    priority_override: null
  },
  // Rabbit Vibrator
  {
    product_id: "prod_adult_toy_002",
    supplier_id: "supplier_adult_001", 
    supplier_sku: "RABBIT_PURPLE",
    cost_price: 2599, // $25.99
    stock_quantity: 20,
    lead_time_days: 5,
    priority_override: null
  },
  // Couples Gift Set
  {
    product_id: "prod_couples_001",
    supplier_id: "supplier_global_001",
    supplier_sku: "COUPLES_SET_KIT", 
    cost_price: 2999, // $29.99
    stock_quantity: 15,
    lead_time_days: 7,
    priority_override: 2 // Override for this product
  },
  // Bondage Starter Kit
  {
    product_id: "prod_accessories_001",
    supplier_id: "supplier_global_001",
    supplier_sku: "BONDAGE_STARTER",
    cost_price: 1499, // $14.99  
    stock_quantity: 40,
    lead_time_days: 3,
    priority_override: null
  }
]

export default async function seedSuppliers(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const supplierModuleService = container.resolve("supplierService")
  
  logger.info("Starting Suppliers Seed...")
  
  try {
    // Create suppliers
    logger.info("Creating suppliers...")
    const createdSuppliers = []
    
    for (const supplierData of suppliers) {
      try {
        const supplier = await supplierModuleService.createSuppliers(supplierData)
        createdSuppliers.push(supplier)
        logger.info(`✅ Created supplier: ${supplier.name}`)
      } catch (error) {
        logger.warn(`⚠️  Supplier ${supplierData.name} might already exist:`, error.message)
        // Try to get existing
        const existing = await supplierModuleService.listSuppliers({
          name: supplierData.name
        })
        if (existing.length > 0) {
          createdSuppliers.push(existing[0])
        }
      }
    }
    
    // Update product mappings with real supplier IDs
    const mappingsWithRealIds = productMappings.map((mapping, index) => {
      const supplier = createdSuppliers.find(s => 
        s.name.includes(specializationMap[mapping.product_id] || "")
      )
      
      return {
        ...mapping,
        supplier_id: supplier?.id || createdSuppliers[index % createdSuppliers.length].id
      }
    })
    
    // Create product-supplier mappings
    logger.info("Creating product-supplier mappings...")
    let successCount = 0
    
    for (const mappingData of mappingsWithRealIds) {
      try {
        const mapping = await supplierModuleService.createProductSupplierMappings(mappingData)
        logger.info(`✅ Created mapping for product: ${mappingData.product_id}`)
        successCount++
      } catch (error) {
        logger.warn(`⚠️  Mapping for ${mappingData.product_id}:`, error.message)
      }
    }
    
    logger.success(`🎉 Suppliers Seed Completed!`)
    logger.success(`✅ Suppliers created: ${createdSuppliers.length}`)
    logger.success(`✅ Mappings created: ${successCount}`)
    
    return {
      suppliersCount: createdSuppliers.length,
      mappingsCount: successCount
    }
    
  } catch (error) {
    logger.error("❌ Suppliers Seed Failed:", error)
    throw error
  }
}

// Helper to map product to supplier specialization
const specializationMap: Record<string, string> = {
  "prod_lingerie_001": "Lingerie",
  "prod_adult_toy_001": "Adult", 
  "prod_lingerie_002": "Lingerie",
  "prod_adult_toy_002": "Adult",
  "prod_couples_001": "Global",
  "prod_accessories_001": "Global"
}
