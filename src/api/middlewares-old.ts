import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Custom admin routes (наши API routes)
    {
      matcher: "/custom/admin*",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"]),
      ],
    },
    // Custom store routes
    {
      matcher: "/custom/store*",
      middlewares: [
        authenticate("customer", ["session", "bearer"], {
          allowUnauthenticated: true,
        }),
      ],
    },
  ],
})
