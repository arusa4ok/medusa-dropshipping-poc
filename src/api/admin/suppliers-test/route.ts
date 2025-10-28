import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

// Test suppliers logic without custom module
const mockSuppliers = [
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

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    suppliers: mockSuppliers,
    mappings: mockMappings,
    message: "Suppliers module test working!"
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, quantity } = req.body
  
  // Simulate supplier selection logic
  const mapping = mockMappings.find(m => m.product_id === product_id)
  if (!mapping) {
    return res.status(404).json({ error: "Product not found" })
  }
  
  if (mapping.stock_quantity < quantity) {
    return res.status(400).json({ error: "Insufficient stock" })
  }
  
  const supplier = mockSuppliers.find(s => s.id === mapping.supplier_id)
  const total_cost = (mapping.cost_price * quantity) + supplier.shipping_cost_base
  
  res.json({
    selected_supplier: {
      id: supplier.id,
      name: supplier.name,
      priority: supplier.priority,
      total_cost,
      mapping: {
        supplier_sku: mapping.supplier_sku,
        stock_quantity: mapping.stock_quantity,
        lead_time_days: mapping.lead_time_days
      }
    }
  })
}
