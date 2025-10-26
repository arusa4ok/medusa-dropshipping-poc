import { MoneyAmount } from '@/types'

interface PriceDisplayProps {
  amount: number
  currencyCode?: string
  className?: string
  showDecimals?: boolean
}

export function PriceDisplay({
  amount,
  currencyCode = 'GBP', // Changed to GBP for Secrets Shop (pounds)
  className = '',
  showDecimals = true,
}: PriceDisplayProps) {
  const formatPrice = (amount: number, currency: string) => {
    const value = amount / 100 // Medusa stores prices in cents

    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    })

    return formatter.format(value)
  }

  return (
    <span className={`font-semibold ${className}`}>
      {formatPrice(amount, currencyCode)}
    </span>
  )
}

// New component for original/sale price with discount like in design system
interface PriceWithDiscountProps {
  originalPrice: number
  salePrice: number
  showDiscount?: boolean
  className?: string
}

export function PriceWithDiscount({
  originalPrice,
  salePrice,
  showDiscount = true,
  className = '',
}: PriceWithDiscountProps) {
  const discountPercent = Math.round(
    ((originalPrice - salePrice) / originalPrice) * 100
  )

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {originalPrice > salePrice && (
        <p className="text-xs text-text-secondary line-through">
          £{(originalPrice / 100).toFixed(2)}
        </p>
      )}
      <p className="text-lg font-bold text-primary">
        £{(salePrice / 100).toFixed(2)}
      </p>
      {showDiscount && originalPrice > salePrice && (
        <span className="text-xs font-semibold text-primary">
          Save {discountPercent}%
        </span>
      )}
    </div>
  )
}

interface PriceRangeProps {
  minAmount: number
  maxAmount: number
  currencyCode?: string
  className?: string
}

export function PriceRange({
  minAmount,
  maxAmount,
  currencyCode = 'USD',
  className = '',
}: PriceRangeProps) {
  if (minAmount === maxAmount) {
    return <PriceDisplay amount={minAmount} currencyCode={currencyCode} className={className} />
  }

  return (
    <span className={`font-semibold ${className}`}>
      <PriceDisplay amount={minAmount} currencyCode={currencyCode} showDecimals={false} />
      {' - '}
      <PriceDisplay amount={maxAmount} currencyCode={currencyCode} showDecimals={false} />
    </span>
  )
}
