import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    message: "✅ Admin API test working!",
    user: req.auth_context?.actor_id,
    suppliers: "Fixed authentication middleware!"
  })
}
