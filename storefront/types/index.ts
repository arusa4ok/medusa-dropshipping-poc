// Medusa Types
export interface Product {
  id: string
  title: string
  description: string | null
  handle: string
  thumbnail: string | null
  variants: ProductVariant[]
  images: ProductImage[]
  collection_id: string | null
  type: ProductType | null
  tags: ProductTag[]
  options: ProductOption[]
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  title: string
  product_id: string
  sku: string | null
  barcode: string | null
  ean: string | null
  upc: string | null
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  hs_code: string | null
  origin_country: string | null
  mid_code: string | null
  material: string | null
  weight: number | null
  length: number | null
  height: number | null
  width: number | null
  options: ProductOptionValue[]
  prices: MoneyAmount[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  url: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface ProductType {
  id: string
  value: string
  created_at: string
  updated_at: string
}

export interface ProductTag {
  id: string
  value: string
  created_at: string
  updated_at: string
}

export interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
  product_id: string
  created_at: string
  updated_at: string
}

export interface ProductOptionValue {
  id: string
  value: string
  option_id: string
  variant_id: string
  created_at: string
  updated_at: string
}

export interface MoneyAmount {
  id: string
  currency_code: string
  amount: number
  variant_id: string
  region_id: string | null
  created_at: string
  updated_at: string
}

export interface Cart {
  id: string
  items: LineItem[]
  region: Region
  shipping_address: Address | null
  billing_address: Address | null
  created_at: string
  updated_at: string
}

export interface LineItem {
  id: string
  cart_id: string
  title: string
  description: string
  thumbnail: string | null
  quantity: number
  variant: ProductVariant
  unit_price: number
  subtotal: number
  total: number
  created_at: string
  updated_at: string
}

export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  countries: Country[]
  created_at: string
  updated_at: string
}

export interface Country {
  id: number
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id: string
}

export interface Address {
  id: string
  customer_id: string | null
  company: string | null
  first_name: string
  last_name: string
  address_1: string
  address_2: string | null
  city: string
  country_code: string
  province: string | null
  postal_code: string
  phone: string | null
  created_at: string
  updated_at: string
}
