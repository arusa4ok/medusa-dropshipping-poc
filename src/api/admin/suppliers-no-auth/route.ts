import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

// Disable authentication for this route
export const AUTHENTICATE = false

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    message: "Admin API without authentication works!",
    suppliers: [
      {
        id: "supplier_001",
        name: "AdultToys Warehouse EU",
        priority: 1,
        cut_off_time: "14:00:00",
        shipping_cost_base: 599,
        is_active: true
      }
    ],
    middleware_status: "AUTHENTICATE = false"
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, quantity } = req.body
  
  res.json({
    message: "Supplier selection test successful",
    selected_supplier: {
      id: "supplier_001",
      name: "AdultToys Warehouse EU",
      priority: 1,
      total_cost: 1899 * quantity + 599
    }
  })
}
