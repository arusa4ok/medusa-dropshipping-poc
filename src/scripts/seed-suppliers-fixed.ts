import { MedusaContainer } from "@medusajs/framework/types"

const suppliers = [
  {
    name: "AdultToys Warehouse EU",
    priority: 1,
    cut_off_time: "14:00:00",
    shipping_cost_base: 599,
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
    shipping_cost_base: 499,
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
    shipping_cost_base: 899,
    is_active: true,
    metadata: {
      region: "Global",
      specialization: "mixed",
      same_day_delivery: false
    }
  }
]

const productMappings = [
  {
    product_id: "red-lace-mini-dress",
    supplier_sku: "DRESS_RED_M",
    cost_price: 1299,
    stock_quantity: 50,
    lead_time_days: 2,
    priority_override: 1
  },
  {
    product_id: "pink-silicone-vibrator",
    supplier_sku: "VIBR_PINK_STD",
    cost_price: 1899,
    stock_quantity: 30,
    lead_time_days: 3,
    priority_override: null
  },
  {
    product_id: "black-lace-teddy",
    supplier_sku: "TEDDY_BLK_OS",
    cost_price: 1599,
    stock_quantity: 25,
    lead_time_days: 2,
    priority_override: null
  },
  {
    product_id: "rabbit-vibrator",
    supplier_sku: "RABBIT_PURPLE",
    cost_price: 2599,
    stock_quantity: 20,
    lead_time_days: 5,
    priority_override: null
  },
  {
    product_id: "couples-gift-set",
    supplier_sku: "COUPLES_SET_KIT",
    cost_price: 2999,
    stock_quantity: 15,
    lead_time_days: 7,
    priority_override: 2
  },
  {
    product_id: "bondage-starter-kit",
    supplier_sku: "BONDAGE_STARTER",
    cost_price: 1499,
    stock_quantity: 40,
    lead_time_days: 3,
    priority_override: null
  }
]

export default async function seedSuppliers(container: MedusaContainer) {
  const logger = container.resolve("logger")

  logger.info("Starting Suppliers Seed...")

  try {
    // Get services
    const supplierService = container.resolve("supplierService")

    if (!supplierService) {
      throw new Error("Supplier service not found. Make sure suppliers module is registered.")
    }

    // Create suppliers
    logger.info("Creating suppliers...")
    const createdSuppliers = []

    for (const supplierData of suppliers) {
      try {
        const supplier = await supplierService.createSuppliers(supplierData)
        createdSuppliers.push(supplier)
        logger.info(`✅ Created supplier: ${supplier.name}`)
      } catch (error) {
        logger.warn(`⚠️  Supplier ${supplierData.name} might already exist:`, error.message)
        // Try to get existing
        try {
          const existing = await supplierService.listSuppliers({
            name: supplierData.name
          })
          if (existing.length > 0) {
            createdSuppliers.push(existing[0])
          }
        } catch (listError) {
          logger.error(`❌ Could not find existing supplier: ${supplierData.name}`)
        }
      }
    }

    // Create supplier ID mapping
    const supplierIdMap: Record<string, string> = {}
    createdSuppliers.forEach((supplier, index) => {
      const supplierKey = suppliers[index].name.includes("AdultToys") ? "supplier_adult_001" :
                         suppliers[index].name.includes("Lingerie") ? "supplier_lingerie_001" :
                         "supplier_global_001"
      supplierIdMap[supplierKey] = supplier.id
    })

    // Create product-supplier mappings
    logger.info("Creating product-supplier mappings...")

    // Map product mappings to real supplier IDs
    const mappingsWithRealIds = productMappings.map((mapping, index) => {
      const supplierKey = index < 2 ? "supplier_adult_001" :
                         index < 3 ? "supplier_lingerie_001" :
                         "supplier_global_001"

      return {
        ...mapping,
        supplier_id: supplierIdMap[supplierKey] || createdSuppliers[0].id
      }
    })

    let successCount = 0

    for (const mappingData of mappingsWithRealIds) {
      try {
        const mapping = await supplierService.createProductSupplierMappings(mappingData)
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
