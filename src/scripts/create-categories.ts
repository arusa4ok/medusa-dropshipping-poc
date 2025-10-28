import { MedusaClient } from '@medusajs/admin-sdk'

const medusa = new MedusaClient({
  baseUrl: 'http://localhost:9000',
  maxRetries: 3,
})

async function createCategories() {
  console.log('Creating categories...')

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

  for (const category of categories) {
    try {
      const createdCategory = await medusa.admin.productCategories.create(category)
      console.log(`✅ Created category: ${createdCategory.productCategory.name}`)
      console.log(`   ID: ${createdCategory.productCategory.id}`)
      console.log(`   Handle: ${createdCategory.productCategory.handle}`)
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error.message)
    }
  }

  console.log('Categories creation completed!')
}

createCategories().catch(console.error)
