import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Zap, Shield, Truck, ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Share2, Check } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
}

export default function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const product = products.find((p) => p.id === productId);
  const { addItem, toggleCart } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, active: false });
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Product not found</p>
          <button onClick={() => onNavigate('catalog')} className="btn-primary">Back to Shop</button>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const similar = products.filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category)).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem(product, selectedSize, selectedColor || product.colors[0], quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem(product, selectedSize, selectedColor || product.colors[0], quantity);
    onNavigate('checkout');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <button onClick={() => onNavigate('home')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('catalog')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Shop</button>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-50 dark:bg-neutral-800 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomPos((z) => ({ ...z, active: false }))}
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={zoomPos.active ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: 'scale(1.5)',
                } : undefined}
              />
              {product.badge && (
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-wider ${
                  product.badge === 'new' ? 'bg-success-500' :
                  product.badge === 'trending' ? 'bg-accent-500' :
                  product.badge === 'limited' ? 'bg-neutral-900 dark:bg-white dark:text-neutral-900' : 'bg-neutral-500'
                }`}>
                  {product.badge === 'limited' && <Zap size={10} className="inline mr-1" />}
                  {product.badge.toUpperCase()}
                </div>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === i
                      ? 'border-neutral-900 dark:border-white scale-95'
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">{product.brand}</span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleItem(product)}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      wishlisted
                        ? 'bg-error-100 dark:bg-error-500/20 text-error-500'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-warning-500 fill-warning-500' : 'text-neutral-300 dark:text-neutral-600'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{product.rating}</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-4xl font-black text-neutral-900 dark:text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-neutral-400 dark:text-neutral-500 line-through">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-error-100 dark:bg-error-500/20 text-error-600 dark:text-error-400 text-sm font-bold px-2.5 py-1 rounded-full">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success-500' : 'bg-neutral-400'}`} />
                <span className={`text-sm font-semibold ${product.inStock ? 'text-success-600 dark:text-success-400' : 'text-neutral-500'}`}>
                  {product.inStock
                    ? product.stockCount && product.stockCount <= 5
                      ? `Only ${product.stockCount} left in stock!`
                      : 'In Stock'
                    : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">Color</span>
                {selectedColor && <span className="text-sm text-neutral-500 dark:text-neutral-400">{selectedColor}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      selectedColor === color
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-bold ${sizeError ? 'text-error-500' : 'text-neutral-900 dark:text-white'}`}>
                  Size (US) {sizeError && '— Please select a size'}
                </span>
                <button className="text-sm text-primary-500 font-semibold hover:text-primary-600 transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`py-3 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent scale-95'
                        : `border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 ${sizeError ? 'border-error-300' : ''}`
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-sm font-bold text-neutral-900 dark:text-white block mb-3">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors text-neutral-600 dark:text-neutral-300 disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-neutral-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors text-neutral-600 dark:text-neutral-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total: <strong className="text-neutral-900 dark:text-white">${(product.price * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                  !product.inStock
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-success-500 text-white scale-95'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-105 active:scale-95'
                }`}
              >
                {addedToCart ? <><Check size={20} /> Added!</> : <><ShoppingBag size={20} /> Add to Cart</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 btn-primary py-4 rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Buy Now' : 'Notify Me'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
              {[
                { icon: Shield, label: 'Authenticated' },
                { icon: Truck, label: 'Free Shipping' },
                { icon: ArrowLeft, label: '30-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon size={20} className="text-neutral-500 dark:text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-neutral-100 dark:border-neutral-800 gap-1">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-sm capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {tab === 'specs' ? 'Specifications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && <span className="ml-2 text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full">{product.reviewCount.toLocaleString()}</span>}
              </button>
            ))}
          </div>

          <div className="pt-8">
            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">{product.description}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs font-semibold capitalize">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-lg">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3.5">
                      <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{key}</span>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex items-center gap-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                  <div className="text-center">
                    <span className="text-6xl font-black text-neutral-900 dark:text-white">{product.rating}</span>
                    <div className="flex justify-center mt-2">
                      {[1,2,3,4,5].map((s) => <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-warning-500 fill-warning-500' : 'text-neutral-300'} />)}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{product.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-xs text-neutral-500 w-4">{stars}</span>
                        <Star size={12} className="text-warning-500 fill-warning-500" />
                        <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-warning-500 rounded-full"
                            style={{ width: `${stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : 2}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-400 w-6">{stars === 5 ? '78' : stars === 4 ? '15' : stars === 3 ? '5' : stars === 2 ? '2' : '0'}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                {[
                  { name: 'Jordan M.', rating: 5, title: 'Absolute fire', body: 'These are exactly as described. Authentication was flawless, shipping was fast. Will definitely buy again.', date: '2 days ago' },
                  { name: 'Casey T.', rating: 5, title: 'Worth every penny', body: 'The quality is incredible. Fit is true to size, very comfortable. The colourway is even better in person.', date: '1 week ago' },
                  { name: 'Alex P.', rating: 4, title: 'Great pair, minor sizing note', body: 'Beautiful sneakers. I would say size up by half if you have wide feet. Otherwise perfect.', date: '2 weeks ago' },
                ].map(({ name, rating, title, body, date }) => (
                  <div key={name} className="border-b border-neutral-100 dark:border-neutral-800 pb-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900 dark:text-white">{name}</span>
                            <span className="text-[10px] bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400 font-bold px-2 py-0.5 rounded-full">VERIFIED</span>
                          </div>
                          <div className="flex mt-0.5">
                            {[1,2,3,4,5].map((s) => <Star key={s} size={11} className={s <= rating ? 'text-warning-500 fill-warning-500' : 'text-neutral-300'} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400 flex-shrink-0">{date}</span>
                    </div>
                    <div className="mt-3">
                      <p className="font-bold text-sm text-neutral-900 dark:text-white mb-1">{title}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} onView={(id) => onNavigate('product', id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
