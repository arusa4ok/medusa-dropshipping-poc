import fs from 'fs'
import path from 'path'

export function parseCSV() {
  const csvFilePath = '/Users/rusakovanton/projects/medusa-dropshipping-poc/docs/import'
  const products: any[] = []

  // Parse Lingerie.csv
  console.log('Parsing Lingerie.csv...')
  const lingerieData = parseFile(path.join(csvFilePath, 'Lingerie.csv'), 'lingerie')
  products.push(...lingerieData)

  // Parse Toys.csv
  console.log('Parsing Toys.csv...')
  const toysData = parseFile(path.join(csvFilePath, 'Toys.csv'), 'toys')
  products.push(...toysData)

  console.log(`Total parsed products: ${products.length}`)
  return products
}

function parseFile(filePath: string, category: string): any[] {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    if (lines.length < 2) {
      return []
    }
    
    const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''))
    const products: any[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(';').map(v => v.trim().replace(/"/g, ''))
      
      if (values.length !== headers.length) continue
      
      const product: any = {}
      headers.forEach((header, index) => {
        product[header] = values[index] || ''
      })
      
      // Only include product_variant rows
      if (product['Row type'] === 'product_variant') {
        const medusaProduct = convertToMedusaFormat(product, category)
        products.push(medusaProduct)
      }
    }
    
    console.log(`Found ${products.length} ${category} products`)
    return products
    
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message)
    return []
  }
}

function convertToMedusaProduct(csvProduct: any, category: string): any {
  return {
    title: csvProduct['Product name'] || 'Unknown Product',
    handle: csvProduct['Storefront link'] || (csvProduct['Product name'] || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    description: csvProduct.Description || '',
    subtitle: csvProduct.subname || '',
    status: 'published' as const,
    categories: [], // Will be populated later
    tags: [{ 
      value: category === 'lingerie' ? 'Lingerie' : 'Adult Toy'
    }],
    options: [{
      title: 'Size',
      values: [csvProduct.Size || csvProduct['SKU name'] || 'One Size']
    }],
    variants: [{
      title: 'Default',
      sku: csvProduct['SKU code'] || `SKU_${Date.now().toString().slice(-8)}`,
      prices: [{
        currency_code: 'USD' as const,
        amount: Math.round((parseFloat(csvProduct.Price) || 29.99) * 100)
      }],
      inventory_quantity: parseInt(csvProduct['In stock']) || 10,
      manage_inventory: true,
      allow_backorder: false
    }],
    images: parseImages(csvProduct['Product images']),
    metadata: {
      import_id: csvProduct.import_id || '',
      brand: csvProduct.Brand || '',
      material: csvProduct.Material || '',
      colour: csvProduct.Colour || '',
      size: csvProduct.Size || '',
      adult_content: true,
      gender: csvProduct.Gender || (category === 'lingerie' ? 'female' : 'unisex'),
      power_type: csvProduct['Power Type'] || '',
      waterproof: csvProduct.Waterproof === 'true' || false,
      insertable_length: parseFloat(csvProduct['Insertable Length']) || 0,
      scent_flavour: csvProduct['Scent & Flavour'] || '',
      texture: csvProduct.Texture || '',
      video_url: csvProduct['Video URL on YouTube, Vimeo or Rutube'] || '',
      on_sale: csvProduct['On Sale'] === 'true' || false,
      discontinued: csvProduct.discontinued === 'true' || false,
      delivery_info: csvProduct.Delivery || '',
      meta_keywords: csvProduct['META Keyword'] || '',
      meta_description: csvProduct['META Description'] || '',
      category: category
    }
  }
}

function convertToMedusaFormat(csvProduct: any, category: string): any {
  const medusaProduct = convertToMedusaProduct(csvProduct, category)
  
  // Set category based on type
  const categoryHandle = category === 'lingerie' ? 'lingerie' : 'adult-toys'
  medusaProduct.categories = [{ handle: categoryHandle }]
  
  return medusaProduct
}

function parseImages(imageString: string): any[] {
  if (!imageString) return []
  
  const imageUrls = imageString.split(';;').filter(url => url.trim())
  
  return imageUrls.map((url, index) => ({
    url: url.trim()
  }))
}
