import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Zap } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onView: (productId: string) => void;
}

const badgeConfig = {
  new: { label: 'NEW', bg: 'bg-success-500', text: 'text-white' },
  trending: { label: 'TRENDING', bg: 'bg-accent-500', text: 'text-white' },
  limited: { label: 'LIMITED', bg: 'bg-neutral-900 dark:bg-white', text: 'text-white dark:text-neutral-900' },
  soldout: { label: 'SOLD OUT', bg: 'bg-neutral-400', text: 'text-white' },
};

export default function ProductCard({ product, onView }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock) {
      addItem(product, product.sizes[4] || product.sizes[0], product.colors[0]);
    }
  };

  return (
    <div
      className="group bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-card dark:shadow-card-dark hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
      onClick={() => onView(product.id)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-50 dark:bg-neutral-700 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 ${badgeConfig[product.badge].bg} ${badgeConfig[product.badge].text} px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider`}>
            {product.badge === 'limited' && <Zap size={8} className="inline mr-1" />}
            {badgeConfig[product.badge].label}
          </div>
        )}

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-3 right-3 bg-error-500 text-white px-2 py-1 rounded-full text-[10px] font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              product.inStock
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700'
                : 'bg-neutral-400 text-white cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={14} />
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onView(product.id); }}
            className="p-2.5 bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-white transition-colors"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleItem(product); }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
            product.discount ? 'top-10' : 'top-3'
          } ${wishlisted
            ? 'bg-error-500 text-white'
            : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 opacity-0 group-hover:opacity-100'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Stock indicator */}
        {product.inStock && product.stockCount && product.stockCount <= 5 && (
          <div className="absolute bottom-14 left-3 right-3 group-hover:hidden">
            <div className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full text-center">
              Only {product.stockCount} left!
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{product.brand}</p>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 mt-0.5 leading-tight">{product.name}</h3>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                className={star <= Math.round(product.rating) ? 'text-warning-500 fill-warning-500' : 'text-neutral-300 dark:text-neutral-600'}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-neutral-900 dark:text-white">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through">${product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="text-xs font-bold text-error-500">-{product.discount}%</span>
          )}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {product.colors.slice(0, 3).map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 border-white dark:border-neutral-700 shadow-sm"
              style={{
                background: color.toLowerCase().includes('white') ? '#fff' :
                            color.toLowerCase().includes('black') ? '#111' :
                            color.toLowerCase().includes('red') ? '#ef4444' :
                            color.toLowerCase().includes('blue') ? '#3b82f6' :
                            color.toLowerCase().includes('green') ? '#22c55e' :
                            color.toLowerCase().includes('yellow') ? '#f59e0b' :
                            color.toLowerCase().includes('grey') || color.toLowerCase().includes('gray') ? '#9ca3af' :
                            '#d4d4d4',
              }}
              title={color}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">+{product.colors.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
