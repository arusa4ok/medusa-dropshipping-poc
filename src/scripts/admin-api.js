const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

let authToken = ''

async function login() {
  try {
    const response = await axios.post(`${MEDUSA_URL}/admin/auth`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    authToken = response.data.auth_token
    console.log('✅ Logged in to admin')
    console.log('Token:', authToken)
    return response.data.auth_token
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
    throw error
  }
}

async function createCategories() {
  await login()
  
  const categories = [
    {
      name: 'Lingerie & Intimate Apparel',
      handle: 'lingerie',
      description: 'Premium lingerie and intimate apparel including babydolls, teddies, corsets, and roleplay costumes from top brands like Leg Avenue and Prowler.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1596498064401-4d5b2c0ff7c2?w=400'
      }
    },
    {
      name: 'Adult Toys & Vibrators',
      handle: 'adult-toys',
      description: 'High-quality adult toys, vibrators, dildos, and intimate accessories from leading brands like Fleshlight, Dreamtoys, and Creature Cocks.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'
      }
    },
    {
      name: 'Couples & Gift Sets',
      handle: 'couples-gifts',
      description: 'Perfect products for couples including gift sets, advent calendars, couples toys, and intimate accessories for shared pleasure.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
      }
    },
    {
      name: 'Adult Accessories & Essentials',
      handle: 'adult-accessories',
      description: 'Essential adult accessories including lubricants, cleaners, bondage gear, and intimate care products.',
      metadata: {
        image: 'https://images.unsplash.com/photo-1584515979916-893c51de9c9c?w=400'
      }
    }
  ]

  console.log('Creating categories...')

  for (const category of categories) {
    try {
      const response = await axios.post(
        `${MEDUSA_URL}/admin/product-categories`,
        category,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`✅ Created category: ${response.data.product_category.name}`)
      console.log(`   ID: ${response.data.product_category.id}`)
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error.response?.data || error.message)
    }
  }
}

createCategories().catch(console.error)
