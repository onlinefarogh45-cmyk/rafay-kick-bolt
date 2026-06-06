import React, { useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export default function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 150 ? 0 : 14.99;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-[80] bg-white dark:bg-neutral-900 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-neutral-900 dark:text-white" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Your Cart</h2>
            {items.length > 0 && (
              <span className="w-6 h-6 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-neutral-400" />
              </div>
              <div>
                <p className="font-bold text-neutral-900 dark:text-white text-lg">Your cart is empty</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Add some fire kicks to get started!</p>
              </div>
              <button
                onClick={() => { onNavigate('catalog'); closeCart(); }}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="p-4 flex gap-4">
                  <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{item.product.brand}</p>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white leading-tight mt-0.5 line-clamp-2">{item.product.name}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-neutral-400 hover:text-error-500 transition-colors flex-shrink-0 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>Size {item.selectedSize}</span>
                      <span>•</span>
                      <span>{item.selectedColor}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-neutral-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="w-7 h-7 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-black text-neutral-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 dark:border-neutral-800 p-6 space-y-4 bg-white dark:bg-neutral-900">
            {/* Coupon */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                <Tag size={15} className="text-neutral-400" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 bg-transparent text-sm outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
                />
              </div>
              <button className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
                Apply
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-lg text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 150 && (
              <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-xl p-2.5">
                Add <strong className="text-neutral-900 dark:text-white">${(150 - subtotal).toFixed(2)}</strong> more for free shipping!
              </p>
            )}

            <button
              onClick={() => { onNavigate('checkout'); closeCart(); }}
              className="w-full btn-primary py-4 text-base justify-between"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
