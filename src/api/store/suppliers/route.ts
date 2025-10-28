import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Try to resolve the supplier service
    const supplierService = req.scope.resolve("supplierService")
    
    // Test if service exists
    if (supplierService) {
      res.json({
        success: true,
        message: "Suppliers module is working!",
        service: "supplierService",
        methods: Object.getOwnPropertyNames(Object.getPrototypeOf(supplierService)).filter(name => name !== 'constructor')
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Supplier service not found"
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Module registration failed",
      error: error.message
    })
  }
}
