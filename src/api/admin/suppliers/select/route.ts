import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

type SelectSupplierRequest = {
  product_id: string
  quantity: number
  region_id: string
  shipping_method?: string
}

export const POST = async (
  req: AuthenticatedMedusaRequest<SelectSupplierRequest>,
  res: MedusaResponse
) => {
  const supplierService = req.scope.resolve("supplierService")
  
  const { product_id, quantity, region_id, shipping_method } = req.validatedBody
  
  try {
    const selection = await supplierService.selectBestSupplier({
      product_id,
      quantity,
      region_id,
      shipping_method
    })
    
    res.json({
      success: true,
      selected_supplier: {
        id: selection.supplier.id,
        name: selection.supplier.name,
        priority: selection.score.priority,
        total_cost: selection.score.total_cost,
        within_cutoff: selection.score.within_cutoff,
        mapping: {
          supplier_sku: selection.mapping.supplier_sku,
          stock_quantity: selection.mapping.stock_quantity,
          lead_time_days: selection.mapping.lead_time_days
        }
      }
    })
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}
