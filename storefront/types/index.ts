// Type definitions for the storefront
export interface Product {
  id: string
  title: string
  description: string
  handle: string
  images: Array<{ url: string }>
  variants: Array<{
    id: string
    title: string
    prices: Array<{ amount: number; currency_code: string }>
  }>
}

export interface Category {
  id: string
  name: string
  handle: string
}
