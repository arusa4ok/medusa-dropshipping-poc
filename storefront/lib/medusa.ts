import Medusa from "@medusajs/js-sdk"

export const medusaClient = new Medusa({
  baseUrl: "http://147.93.157.172:9000",
  debug: process.env.NODE_ENV === "development",
})
