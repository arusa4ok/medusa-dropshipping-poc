import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  showDiscount?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency = '£',
  showDiscount = false,
  className = '',
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasDiscount && originalPrice && (
        <>
          <span className="text-sm text-gray-500 line-through">
            {currency}{originalPrice.toFixed(2)}
          </span>
          {showDiscount && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </>
      )}
      <span className={`font-bold ${hasDiscount ? 'text-primary' : 'text-text'}`}>
        {currency}{price.toFixed(2)}
      </span>
    </div>
  );
};

interface PriceWithDiscountProps {
  originalPrice?: number;
  salePrice: number;
  showDiscount?: boolean;
  currency?: string;
  className?: string;
}

export const PriceWithDiscount: React.FC<PriceWithDiscountProps> = ({
  originalPrice,
  salePrice,
  showDiscount = true,
  currency = '£',
  className = '',
}) => {
  return (
    <PriceDisplay
      price={salePrice}
      originalPrice={originalPrice}
      currency={currency}
      showDiscount={showDiscount}
      className={className}
    />
  );
};

export default PriceDisplay;
