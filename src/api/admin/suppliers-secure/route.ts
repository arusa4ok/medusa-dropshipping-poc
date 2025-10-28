import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // Get authenticated user info
  const userId = req.auth_context?.actor_id
  
  res.json({
    message: "Suppliers API working with proper authentication!",
    authenticated_user: userId,
    suppliers: [
      {
        id: "supplier_001",
        name: "AdultToys Warehouse EU",
        priority: 1,
        cut_off_time: "14:00:00",
        shipping_cost_base: 599,
        is_active: true,
        metadata: { region: "EU", specialization: "adult toys" }
      },
      {
        id: "supplier_002",
        name: "Lingerie Direct", 
        priority: 2,
        cut_off_time: "16:00:00",
        shipping_cost_base: 499,
        is_active: true,
        metadata: { region: "EU", specialization: "lingerie" }
      }
    ]
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, quantity, region_id } = req.validatedBody
  
  // Mock supplier selection logic
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
    }
  ]
  
  const mapping = mockMappings.find(m => m.product_id === product_id)
  if (!mapping) {
    return res.status(404).json({ error: "Product not found" })
  }
  
  if (mapping.stock_quantity < quantity) {
    return res.status(400).json({ error: "Insufficient stock" })
  }
  
  const supplier = mockSuppliers.find(s => s.id === mapping.supplier_id)
  const effectivePriority = mapping.priority_override || supplier.priority
  const total_cost = (mapping.cost_price * quantity) + supplier.shipping_cost_base
  
  res.json({
    success: true,
    selection: {
      product_id,
      quantity,
      selected_supplier: {
        id: supplier.id,
        name: supplier.name,
        priority: effectivePriority,
        total_cost,
        supplier_sku: mapping.supplier_sku,
        lead_time_days: mapping.lead_time_days,
        within_cutoff: true // Mock check
      }
    }
  })
}
