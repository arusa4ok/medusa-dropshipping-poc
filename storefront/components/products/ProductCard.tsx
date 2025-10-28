import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { PriceWithDiscount } from '../ui/PriceDisplay';

interface ProductCardProps {
  id: string;
  title: string;
  brand?: string;
  image: string;
  originalPrice?: number;
  salePrice: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  brand,
  image,
  originalPrice,
  salePrice,
  discount,
  rating = 4.5,
  reviews = 42,
  onAddToCart,
  onToggleWishlist,
}) => {
  const renderStars = (rating: number) => {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  return (
    <div className="card group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image with hover zoom */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {image && image.trim() !== '' ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>
        )}

        {/* Wishlist icon top-right */}
        <button
          onClick={onToggleWishlist}
          className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>

        {/* Discount badge top-left */}
        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand/Category */}
        {brand && (
          <p className="text-xs uppercase text-text-secondary mb-1">{brand}</p>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold mb-2 line-clamp-2 text-text">{title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm">{renderStars(rating)}</span>
          <span className="text-xs text-text-secondary">({reviews})</span>
        </div>

        {/* Price */}
        <PriceWithDiscount
          originalPrice={originalPrice}
          salePrice={salePrice}
          showDiscount={true}
          className="mb-3"
        />

        {/* Add to Basket */}
        <button
          onClick={onAddToCart}
          className="btn-primary w-full"
        >
          Add to Basket
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
