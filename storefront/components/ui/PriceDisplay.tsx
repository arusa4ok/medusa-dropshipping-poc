import { MoneyAmount } from '@/types'

interface PriceDisplayProps {
  amount: number
  currencyCode?: string
  className?: string
  showDecimals?: boolean
}

export function PriceDisplay({
  amount,
  currencyCode = 'USD',
  className = '',
  showDecimals = true,
}: PriceDisplayProps) {
  const formatPrice = (amount: number, currency: string) => {
    const value = amount / 100 // Medusa stores prices in cents

    const formatter = new Intl.NumberFormat('en-US', {
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
