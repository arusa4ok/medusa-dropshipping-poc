import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, Product, ProductVariant } from '@/types'

interface CartStore {
  cart: Cart | null
  isLoading: boolean

  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  clearCart: () => void

  // Computed
  itemCount: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      addItem: async (product, variant, quantity) => {
        set({ isLoading: true })
        try {
          // TODO: Implement Medusa cart API call
          console.log('Adding to cart:', product.title, variant.id, quantity)
        } catch (error) {
          console.error('Failed to add item:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (lineItemId) => {
        set({ isLoading: true })
        try {
          // TODO: Implement remove from cart
          console.log('Removing item:', lineItemId)
        } catch (error) {
          console.error('Failed to remove item:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (lineItemId, quantity) => {
        set({ isLoading: true })
        try {
          // TODO: Implement update quantity
          console.log('Updating quantity:', lineItemId, quantity)
        } catch (error) {
          console.error('Failed to update quantity:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: () => {
        set({ cart: null })
      },

      itemCount: () => {
        const cart = get().cart
        if (!cart) return 0
        return cart.items.reduce((total, item) => total + item.quantity, 0)
      },

      total: () => {
        const cart = get().cart
        if (!cart) return 0
        return cart.items.reduce((total, item) => total + item.total, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
