import React from 'react'

interface RatingProps {
  rating: number // 0-5
  reviewCount?: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function Rating({ 
  rating, 
  reviewCount, 
  size = 'medium', 
  className = '' 
}: RatingProps) {
  // Size configurations
  const sizeConfig = {
    small: {
      starSize: 'text-xs',
      containerSize: 'gap-0.5',
      textSize: 'text-xs'
    },
    medium: {
      starSize: 'text-sm',
      containerSize: 'gap-1',
      textSize: 'text-sm'
    },
    large: {
      starSize: 'text-lg',
      containerSize: 'gap-1.5',
      textSize: 'text-base'
    }
  }

  const config = sizeConfig[size]

  // Generate star display
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - Math.ceil(rating)

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className={`${config.starSize}`} style={{ color: '#FFB800' }}>
          ★
        </span>
      )
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={`${config.starSize} relative`} style={{ color: '#FFB800' }}>
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            ★
          </span>
          <span className="text-gray-300">
            ★
          </span>
        </span>
      )
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={`${config.starSize} text-gray-300`}>
          ★
        </span>
      )
    }

    return stars
  }

  return (
    <div className={`flex items-center ${config.containerSize} ${className}`}>
      {/* Stars */}
      <div className="flex items-center">
        {renderStars()}
      </div>

      {/* Rating number and review count */}
      <div className="flex items-center gap-1">
        <span className={`${config.textSize} font-medium text-text`}>
          {rating.toFixed(1)}
        </span>
        {reviewCount && (
          <span className={`${config.textSize} text-text-secondary`}>
            ({reviewCount})
          </span>
        )}
      </div>
    </div>
  )
}

// Additional component for just stars without text
interface RatingStarsProps {
  rating: number // 0-5
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function RatingStars({ 
  rating, 
  size = 'medium', 
  className = '' 
}: RatingStarsProps) {
  // Size configurations
  const sizeConfig = {
    small: 'text-xs',
    medium: 'text-sm', 
    large: 'text-lg'
  }

  const starSize = sizeConfig[size]

  // Generate star display
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - Math.ceil(rating)

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className={`${starSize}`} style={{ color: '#FFB800' }}>
          ★
        </span>
      )
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={`${starSize} relative`} style={{ color: '#FFB800' }}>
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            ★
          </span>
          <span className="text-gray-300">
            ★
          </span>
        </span>
      )
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={`${starSize} text-gray-300`}>
          ★
        </span>
      )
    }

    return stars
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {renderStars()}
    </div>
  )
}