import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const supplierService = req.scope.resolve("supplierService")
  
  const suppliers = await supplierService.listSuppliers()
  
  res.json({
    suppliers,
    count: suppliers.length
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const supplierService = req.scope.resolve("supplierService")
  
  const supplier = await supplierService.createSuppliers(req.validatedBody)
  
  res.status(201).json({
    supplier
  })
}
