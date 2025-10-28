import { MedusaClient } from '@medusajs/admin-sdk'
import { mockProducts } from '../../../storefront/lib/mockData'

const medusa = new MedusaClient({
  baseUrl: 'http://localhost:9000',
  maxRetries: 3,
})

async function importProducts() {
  console.log('Starting product import...')

  // Get existing categories
  const { product_categories } = await medusa.admin.productCategories.list()
  
  // Create category handle to ID map
  const categoryMap = new Map()
  product_categories.forEach(cat => {
    categoryMap.set(cat.handle, cat.id)
  })

  console.log('Found categories:', Array.from(categoryMap.keys()))

  for (const product of mockProducts.slice(0, 5)) { // Start with 5 products for testing
    try {
      console.log(`\n📦 Importing: ${product.title}`)
      
      // Map collection_id to category_id
      const categoryHandle = {
        'col_lingerie': 'lingerie',
        'col_toys': 'adult-toys', 
        'col_couples': 'couples-gifts',
        'col_accessories': 'adult-accessories'
      }[product.collection_id || '']

      const categoryId = categoryMap.get(categoryHandle)

      if (!categoryId) {
        console.log(`⚠️  Skipping ${product.title} - no category found for ${product.collection_id}`)
        continue
      }

      // Prepare product data for Medusa
      const productData = {
        title: product.title,
        handle: product.handle,
        description: product.description?.replace(/<[^>]*>/g, '') || '', // Strip HTML
        subtitle: product.subtitle || '',
        status: 'published',
        categories: [{ id: categoryId }],
        options: [
          {
            title: 'Size',
            values: ['One Size']
          }
        ],
        variants: [{
          title: 'Default',
          sku: `SKU_${product.id.slice(-8)}`,
          prices: [{
            currency_code: 'USD',
            amount: product.variants[0]?.prices[0]?.amount || 9999
          }],
          inventory_quantity: 10,
          manage_inventory: true
        }],
        images: product.images?.map(img => ({
          url: img.url.startsWith('http') ? img.url : `https://via.placeholder.com/400x600.png?text=${encodeURIComponent(product.title)}`,
          filename: `${product.handle}.jpg`
        })) || [],
        tags: product.tags?.map(tag => ({ value: tag.value })) || [],
        metadata: {
          brand: (product as any).metadata?.brand || product.brand || '',
          material: (product as any).metadata?.material || product.material || '',
          colour: (product as any).metadata?.colour || product.colour || '',
          adult_content: true,
          gender: (product as any).metadata?.gender || product.gender || '',
          import_id: (product as any).metadata?.import_id || ''
        }
      }

      const createdProduct = await medusa.admin.products.create(productData)
      console.log(`✅ Imported: ${createdProduct.product.title}`)
      console.log(`   Product ID: ${createdProduct.product.id}`)
      
    } catch (error) {
      console.error(`❌ Error importing ${product.title}:`, error.message)
    }
  }

  console.log('\n🎉 Product import completed!')
}

importProducts().catch(console.error)
