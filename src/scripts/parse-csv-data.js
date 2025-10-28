const fs = require('fs')
const path = require('path')

const csvFilePath = '/Users/rusakovanton/projects/medusa-dropshipping-poc/docs/import'
const outputPath = '/Users/rusakovanton/projects/medusa-dropshipping-poc/docs/import'

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  
  if (lines.length < 2) {
    return []
  }
  
  // Use semicolon as delimiter
  const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''))
  const products = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Simple CSV parsing with semicolon delimiter
    const values = line.split(';').map(v => v.trim().replace(/"/g, ''))
    
    if (values.length !== headers.length) continue
    
    const product = {}
    headers.forEach((header, index) => {
      product[header] = values[index] || ''
    })
    
    // Only include product_variant rows
    if (product['Row type'] === 'product_variant') {
      products.push(product)
    }
  }
  
  return products
}

// Parse Lingerie.csv
console.log('Parsing Lingerie.csv...')
const lingerieProducts = parseCSV(path.join(csvFilePath, 'Lingerie.csv'))
console.log(`Found ${lingerieProducts.length} lingerie products`)

// Parse Toys.csv  
console.log('Parsing Toys.csv...')
const toysProducts = parseCSV(path.join(csvFilePath, 'Toys.csv'))
console.log(`Found ${toysProducts.length} toys products`)

// Convert to Medusa format
function convertToMedusaProduct(product, category) {
  return {
    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: product['Product name'] || 'Unknown Product',
    handle: product['Storefront link'] || (product['Product name'] || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    description: product.Description || '',
    subtitle: product.subname || '',
    collection_id: category === 'lingerie' ? 'col_lingerie' : 'col_toys',
    status: 'published',
    tags: [{ 
      id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, 
      value: category === 'lingerie' ? 'Lingerie' : 'Adult Toy',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }],
    options: [{
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: 'Size',
      values: [{
        id: `val_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        value: product.Size || product['SKU name'] || 'One Size',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }],
    variants: [{
      id: `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'Default',
      product_id: '',
      sku: product['SKU code'] || `SKU_${Date.now().toString().slice(-8)}`,
      barcode: '',
      ean: '',
      upc: null,
      inventory_quantity: parseInt(product['In stock']) || 10,
      allow_backorder: false,
      manage_inventory: true,
      hs_code: null,
      origin_country: 'UK',
      mid_code: null,
      material: product.Material || '',
      weight: 0,
      length: 0,
      height: null,
      width: null,
      options: [],
      prices: [{
        currency_code: 'USD',
        amount: Math.round((parseFloat(product.Price) || 29.99) * 100) // Convert to cents
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }],
    images: parseImages(product['Product images']) || [],
    metadata: {
      import_id: product.import_id || '',
      brand: product.Brand || '',
      material: product.Material || '',
      colour: product.Colour || '',
      size: product.Size || '',
      adult_content: true,
      gender: product.Gender || (category === 'lingerie' ? 'female' : 'unisex'),
      power_type: product['Power Type'] || '',
      waterproof: product.Waterproof === 'true' || false,
      insertable_length: parseFloat(product['Insertable Length']) || 0,
      scent_flavour: product['Scent & Flavour'] || '',
      texture: product.Texture || '',
      video_url: product['Video URL on YouTube, Vimeo or Rutube'] || '',
      on_sale: product['On Sale'] === 'true' || false,
      discontinued: product.discontinued === 'true' || false,
      delivery_info: product.Delivery || '',
      meta_keywords: product['META Keyword'] || '',
      meta_description: product['META Description'] || '',
      category: category
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.0 + Math.random(), // Random rating 4.0-5.0
    review_count: Math.floor(Math.random() * 100) + 10, // Random reviews 10-110
    free_shipping: Math.random() > 0.5,
    warranty: false,
    brand: product.Brand || '',
    material: product.Material || '',
    dimensions: { 
      length: 10, 
      width: 5, 
      height: 3 
    },
    sku: product['SKU code'] || '',
    adult_content: true,
    age_group: product['Age group'] || 'adult',
    gender: product.Gender || (category === 'lingerie' ? 'female' : 'unisex'),
    waterproof: product.Waterproof === 'true' || false,
    power_type: product['Power Type'] || '',
    scent_flavour: product['Scent & Flavour'] || '',
    texture: product.Texture || '',
    insertable_length: parseFloat(product['Insertable Length']) || 0,
    meta_keywords: product['META Keyword'] || '',
    meta_description: product['META Description'] || '',
    video_url: product['Video URL on YouTube, Vimeo or Rutube'] || '',
    colour: product.Colour || '',
    on_sale: product['On Sale'] === 'true' || false,
    discontinued: product.discontinued === 'true' || false,
    delivery_info: product.Delivery || ''
  }
}

function parseImages(imageString) {
  if (!imageString) return []
  
  // Split by ;; and clean up URLs
  const imageUrls = imageString.split(';;').filter(url => url.trim())
  
  return imageUrls.map((url, index) => ({
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url: url.trim(),
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
}

// Convert all products
const allProducts = []

// Process lingerie products (first 30 for demo)
for (let i = 0; i < Math.min(lingerieProducts.length, 30); i++) {
  const product = convertToMedusaProduct(lingerieProducts[i], 'lingerie')
  allProducts.push(product)
}

// Process toys products (first 30 for demo)
for (let i = 0; i < Math.min(toysProducts.length, 30); i++) {
  const product = convertToMedusaProduct(toysProducts[i], 'toys')
  allProducts.push(product)
}

console.log(`\nConverted ${allProducts.length} products to Medusa format`)

// Save to JSON files
fs.writeFileSync(
  path.join(outputPath, 'products.json'),
  JSON.stringify(allProducts, null, 2)
)

// Create collections file
const collections = [
  {
    id: 'col_lingerie',
    title: 'Lingerie & Intimate Apparel',
    handle: 'lingerie',
    description: 'Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes.',
    image: 'https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'col_toys',
    title: 'Adult Toys & Vibrators',
    handle: 'adult-toys',
    description: 'High-quality adult toys, vibrators, and intimate accessories.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'col_couples',
    title: 'Couples & Gift Sets',
    handle: 'couples-gifts',
    description: 'Perfect products for couples including gift sets and shared pleasure items.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'col_accessories',
    title: 'Adult Accessories & Essentials',
    handle: 'adult-accessories',
    description: 'Essential adult accessories including lubricants, cleaners, and care products.',
    image: 'https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

fs.writeFileSync(
  path.join(outputPath, 'collections.json'),
  JSON.stringify(collections, null, 2)
)

console.log('✅ Saved products.json and collections.json')
console.log('\nSample product:')
console.log(JSON.stringify(allProducts[0], null, 2))
