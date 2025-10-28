import { createWorkflow, WorkflowResponse, transform } from "@medusajs/workflows-sdk"
import { Modules } from "@medusajs/utils"

type OrderFulfillmentInput = {
  order_id: string
}

const orderFulfillmentWorkflow = createWorkflow(
  "order-fulfillment",
  function (input: OrderFulfillmentInput) {
    
    // For each line item, select best supplier
    const supplierAssignments = transform(input, async ({ order_id }) => {
      const { orderService, supplierService } = globalThis.MEDUSA_CONTAINER || {}
      
      if (!orderService || !supplierService) {
        throw new Error("Required services not available")
      }
      
      const order = await orderService.retrieve(order_id, {
        relations: ["items", "region"]
      })
      
      const assignments = []
      
      for (const item of order.items) {
        const selection = await supplierService.selectBestSupplier({
          product_id: item.product_id,
          quantity: item.quantity,
          region_id: order.region_id,
          shipping_method: order.shipping_methods?.[0]?.id
        })
        
        assignments.push({
          line_item_id: item.id,
          supplier_id: selection.supplier.id,
          supplier_name: selection.supplier.name,
          cost: selection.score.total_cost
        })
      }
      
      return assignments
    })
    
    // Create fulfillments grouped by supplier
    const fulfillments = transform(supplierAssignments, (assignments) => {
      // Group by supplier_id
      const grouped = assignments.reduce((acc, assignment) => {
        const key = assignment.supplier_id
        if (!acc[key]) {
          acc[key] = {
            supplier_id: assignment.supplier_id,
            supplier_name: assignment.supplier_name,
            line_items: [],
            total_cost: 0
          }
        }
        acc[key].line_items.push({
          line_item_id: assignment.line_item_id
        })
        acc[key].total_cost += assignment.cost
        return acc
      }, {})
      
      return Object.values(grouped)
    })
    
    return new WorkflowResponse({ fulfillments })
  }
)

export default orderFulfillmentWorkflow
