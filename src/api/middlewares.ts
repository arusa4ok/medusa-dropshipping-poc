import { defineMiddlewares } from "@medusajs/framework/http"

// Override default admin middleware for custom routes
export default defineMiddlewares({
  routes: [
    // Allow custom admin routes without authentication for testing
    {
      matcher: "/custom/admin*",
      middlewares: [],
    },
    {
      matcher: "/custom/test*",
      middlewares: [],
    },
    // Keep default admin authentication
    {
      matcher: "/admin*",
      middlewares: [],
    },
  ],
})
