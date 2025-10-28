const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

let authToken = ''

// Adult products data for Medusa v2
const adultProducts = [
  {
    title: "Red Lace Mini Dress",
    handle: "red-lace-mini-dress",
    description: "Sexy red lace mini dress with matching G-string and adjustable straps. Perfect for intimate moments and roleplay.",
    status: "published",
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "DRESS_RED_001",
      prices: [{ currency_code: "USD", amount: 2799 }],
      inventory_quantity: 10,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
    }],
    metadata: {
      brand: "Leg Avenue",
      material: "Polyester",
      colour: "Red",
      adult_content: true,
      gender: "female"
    }
  },
  {
    title: "Pink Silicone Vibrator",
    handle: "pink-silicone-vibrator",
    description: "High-quality silicone vibrator with multiple vibration modes. Waterproof and rechargeable for ultimate pleasure.",
    status: "published",
    tags: [{ value: "Adult Toy" }],
    options: [{ title: "Size", values: ["Standard"] }],
    variants: [{
      title: "Default",
      sku: "VIBRATOR_PINK_001",
      prices: [{ currency_code: "USD", amount: 3999 }],
      inventory_quantity: 5,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
    }],
    metadata: {
      brand: "DreamToys",
      material: "Silicone",
      colour: "Pink",
      adult_content: true,
      gender: "unisex",
      waterproof: true
    }
  },
  {
    title: "Black Lace Teddy",
    handle: "black-lace-teddy",
    description: "Elegant black lace teddy with intricate detailing and adjustable straps for perfect fit.",
    status: "published",
    tags: [{ value: "Lingerie" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "TEDDY_BLACK_001",
      prices: [{ currency_code: "USD", amount: 3499 }],
      inventory_quantity: 7,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
    }],
    metadata: {
      brand: "Leg Avenue",
      material: "Lace",
      colour: "Black",
      adult_content: true,
      gender: "female"
    }
  },
  {
    title: "Rabbit Vibrator",
    handle: "rabbit-vibrator",
    description: "Dual stimulation rabbit vibrator with multiple speeds and patterns for intense pleasure.",
    status: "published",
    tags: [{ value: "Adult Toy" }],
    options: [{ title: "Size", values: ["Standard"] }],
    variants: [{
      title: "Default",
      sku: "RABBIT_VIB_001",
      prices: [{ currency_code: "USD", amount: 5999 }],
      inventory_quantity: 4,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
    }],
    metadata: {
      brand: "Rabbit Co",
      material: "Silicone",
      colour: "Purple",
      adult_content: true,
      gender: "unisex",
      waterproof: true
    }
  },
  {
    title: "Couples Gift Set",
    handle: "couples-gift-set",
    description: "Perfect gift set for couples including massage oil, handcuffs, and other intimate accessories.",
    status: "published",
    tags: [{ value: "Couples" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "COUPLES_SET_001",
      prices: [{ currency_code: "USD", amount: 4999 }],
      inventory_quantity: 8,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
    }],
    metadata: {
      brand: "Various",
      material: "Mixed",
      colour: "Assorted",
      adult_content: true,
      gender: "unisex"
    }
  },
  {
    title: "Bondage Starter Kit",
    handle: "bondage-starter-kit",
    description: "Perfect bondage starter kit with restraints, blindfold, and accessories for beginners.",
    status: "published",
    tags: [{ value: "Accessories" }],
    options: [{ title: "Size", values: ["One Size"] }],
    variants: [{
      title: "Default",
      sku: "BONDAGE_KIT_001",
      prices: [{ currency_code: "USD", amount: 2999 }],
      inventory_quantity: 12,
      manage_inventory: true
    }],
    images: [{
      url: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
    }],
    metadata: {
      brand: "Bondage Pro",
      material: "Mixed",
      colour: "Black",
      adult_content: true,
      gender: "unisex"
    }
  }
]

async function login() {
  try {
    console.log('🔐 Logging in to Medusa admin...')
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    authToken = response.data.token
    console.log('✅ Successfully logged in')
    return response.data.token
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
    throw error
  }
}

async function createCategories() {
  console.log('\n📁 Creating adult categories...')
  
  const categories = [
    {
      name: "Lingerie & Intimate Apparel",
      handle: "lingerie",
      description: "Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes.",
      metadata: {
        image: "https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400"
      }
    },
    {
      name: "Adult Toys & Vibrators",
      handle: "adult-toys",
      description: "High-quality adult toys, vibrators, and intimate accessories from leading brands.",
      metadata: {
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"
      }
    },
    {
      name: "Couples & Gift Sets",
      handle: "couples-gifts",
      description: "Perfect products for couples including gift sets, advent calendars, and intimate accessories.",
      metadata: {
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
      }
    },
    {
      name: "Adult Accessories & Essentials",
      handle: "adult-accessories",
      description: "Essential adult accessories including lubricants, cleaners, bondage gear, and care products.",
      metadata: {
        image: "https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400"
      }
    }
  ]

  const createdCategories = []

  // Try different endpoints for Medusa v2
  const endpoints = [
    '/admin/product-categories',
    '/admin/categories',
    '/admin/collections'
  ]

  for (const category of categories) {
    let categoryCreated = false
    
    for (const endpoint of endpoints) {
      if (categoryCreated) break
      
      try {
        const response = await axios.post(
          `${MEDUSA_URL}${endpoint}`,
          category,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        
        console.log(`✅ Created category: ${category.name} (${endpoint})`)
        createdCategories.push({
          id: response.data.product_category?.id || response.data.category?.id || response.data.collection?.id,
          handle: category.handle,
          name: category.name
        })
        categoryCreated = true
        
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`📍 Endpoint ${endpoint} not found, trying next...`)
        } else if (error.response?.status === 403) {
          console.log(`🔒 Endpoint ${endpoint} forbidden, trying next...`)
        } else {
          console.log(`⚠️  Endpoint ${endpoint} failed:`, error.response?.data?.message || error.message)
        }
      }
    }
    
    if (!categoryCreated) {
      console.error(`❌ Failed to create category: ${category.name}`)
    }
  }

  return createdCategories
}

async function createProducts(categories) {
  console.log('\n📦 Creating adult products...')
  
  const categoryMap = new Map()
  categories.forEach(cat => {
    categoryMap.set(cat.handle, cat.id)
  })

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < adultProducts.length; i++) {
    const product = adultProducts[i]
    
    try {
      console.log(`📦 [${i + 1}/${adultProducts.length}] Creating: ${product.title}`)
      
      // Map tag to category
      let categoryHandle = 'lingerie'
      if (product.tags[0].value === 'Adult Toy') categoryHandle = 'adult-toys'
      else if (product.tags[0].value === 'Couples') categoryHandle = 'couples-gifts'
      else if (product.tags[0].value === 'Accessories') categoryHandle = 'adult-accessories'
      
      const categoryId = categoryMap.get(categoryHandle)

      // Prepare product data for Medusa v2
      const productData = {
        title: product.title,
        handle: product.handle,
        description: product.description,
        status: product.status,
        ...(categoryId && { category_id: categoryId }),
        tags: product.tags,
        options: product.options,
        variants: product.variants,
        images: product.images,
        metadata: product.metadata
      }

      const response = await axios.post(
        `${MEDUSA_URL}/admin/products`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log(`✅ Created: ${response.data.product?.title || response.data.title}`)
      successCount++
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      errorCount++
      console.error(`❌ Error creating product ${product.title}:`, error.response?.data?.message || error.message)
    }
  }

  return { successCount, errorCount }
}

async function main() {
  console.log('🚀 Starting automatic products import to Medusa backend...')
  
  try {
    // Login
    await login()
    
    // Create categories
    const categories = await createCategories()
    
    // Create products
    const { successCount, errorCount } = await createProducts(categories)
    
    console.log('\n🎉 Import completed!')
    console.log(`✅ Successfully created: ${successCount} products`)
    console.log(`❌ Failed to create: ${errorCount} products`)
    console.log(`📁 Created: ${categories.length} categories`)
    
    console.log('\n🌐 You can now visit:')
    console.log(`   Admin: ${MEDUSA_URL}/app`)
    console.log(`   Storefront: http://localhost:8001/products`)
    console.log(`   Cart: http://localhost:8001/cart`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
