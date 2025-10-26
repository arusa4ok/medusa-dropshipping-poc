import Image from 'next/image'
import { LineItem } from '@/types'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { Button } from '@/components/ui/Button'

interface CartItemProps {
  item: LineItem
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 border-b">
      <div className="relative w-24 h-24 bg-gray-100 rounded">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover rounded"
          />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">-</Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button size="sm" variant="outline">+</Button>
          </div>

          <PriceDisplay amount={item.unit_price} className="text-lg" />
        </div>
      </div>

      <Button variant="outline" size="sm">Remove</Button>
    </div>
  )
}
