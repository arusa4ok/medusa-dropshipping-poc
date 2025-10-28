import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const userId = req.auth_context?.actor_id

  res.json({
    message: "✅ CUSTOM Admin API with authentication working!",
    authenticated_user: userId,
    timestamp: new Date().toISOString(),
    suppliers: [
      {
        id: "supplier_001",
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
        id: "supplier_002",
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
        id: "supplier_003",
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
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, quantity, region_id } = req.validatedBody

  // Mock supplier selection logic implementation
  const mockMappings = [
    {
      product_id: "red-lace-mini-dress",
      supplier_id: "supplier_002",
      supplier_sku: "DRESS_RED_M",
      cost_price: 1299,
      stock_quantity: 50,
      lead_time_days: 2,
      priority_override: 1
    },
    {
      product_id: "pink-silicone-vibrator",
      supplier_id: "supplier_001",
      supplier_sku: "VIBR_PINK_STD",
      cost_price: 1899,
      stock_quantity: 30,
      lead_time_days: 3,
      priority_override: null
    },
    {
      product_id: "black-lace-teddy",
      supplier_id: "supplier_002",
      supplier_sku: "TEDDY_BLK_OS",
      cost_price: 1599,
      stock_quantity: 25,
      lead_time_days: 2,
      priority_override: null
    }
  ]

  const mockSuppliers = [
    {
      id: "supplier_001",
      name: "AdultToys Warehouse EU",
      priority: 1,
      cut_off_time: "14:00:00",
      shipping_cost_base: 599,
    },
    {
      id: "supplier_002",
      name: "Lingerie Direct",
      priority: 2,
      cut_off_time: "16:00:00",
      shipping_cost_base: 499,
    },
    {
      id: "supplier_003",
      name: "Global Adult Supply",
      priority: 3,
      cut_off_time: "12:00:00",
      shipping_cost_base: 899,
    }
  ]

  // Find mapping for product
  const mapping = mockMappings.find(m => m.product_id === product_id)
  if (!mapping) {
    return res.status(404).json({
      error: "Product not found",
      available_products: mockMappings.map(m => m.product_id)
    })
  }

  // Check stock
  if (mapping.stock_quantity < quantity) {
    return res.status(400).json({
      error: "Insufficient stock",
      available: mapping.stock_quantity,
      requested: quantity
    })
  }

  // Get supplier
  const supplier = mockSuppliers.find(s => s.id === mapping.supplier_id)

  // Calculate effective priority
  const effectivePriority = mapping.priority_override || supplier.priority

  // Calculate total cost
  const product_cost = mapping.cost_price * quantity
  const total_cost = product_cost + supplier.shipping_cost_base

  // Check cutoff time
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`
  const within_cutoff = currentTime < supplier.cut_off_time

  res.json({
    success: true,
    selection: {
      product_id,
      quantity,
      region_id,
      selected_supplier: {
        id: supplier.id,
        name: supplier.name,
        priority: effectivePriority,
        total_cost,
        breakdown: {
          product_cost,
          shipping_cost: supplier.shipping_cost_base,
          total_cost
        },
        supplier_sku: mapping.supplier_sku,
        lead_time_days: mapping.lead_time_days,
        stock_remaining: mapping.stock_quantity - quantity,
        within_cutoff,
        cutoff_time: supplier.cut_off_time,
        current_time: currentTime
      },
      algorithm: "✅ Supplier selection working with priority and cost optimization"
    }
  })
}
