import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

// Simple test endpoint without authentication
export const AUTHENTICATE = false

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    message: "✅ Custom API working without auth!",
    suppliers: [
      {
        id: "supplier_001",
        name: "AdultToys Warehouse EU",
        priority: 1,
        cost_price: 1899,
        total_cost: 1899 * 2 + 599
      }
    ]
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, quantity } = req.body

  res.json({
    message: "✅ Supplier selection test working!",
    selection: {
      product_id,
      quantity,
      selected_supplier: {
        name: "AdultToys Warehouse EU",
        priority: 1,
        total_cost: 1899 * quantity + 599,
        algorithm: "Priority 1 selected automatically"
      }
    }
  })
}
