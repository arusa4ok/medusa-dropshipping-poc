import { medusaClient } from '../../../lib/medusa'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { products } = await medusaClient.store.product.list()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
