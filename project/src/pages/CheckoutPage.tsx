import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle, Lock, ChevronRight, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

type Step = 'info' | 'shipping' | 'payment' | 'review';

const steps: { id: Step; label: string }[] = [
  { id: 'info', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>('info');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'United States' });
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState<'card' | 'paypal' | 'apple' | 'google'>('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const tax = subtotal * 0.08;
  const shippingCost = shipping === 'express' ? 24.99 : shipping === 'overnight' ? 49.99 : subtotal >= 150 ? 0 : 14.99;
  const total = subtotal + tax + shippingCost;

  const stepIndex = steps.findIndex((s) => s.id === step);

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 max-w-lg w-full text-center shadow-card-hover animate-scale-in">
          <div className="w-20 h-20 bg-success-100 dark:bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-success-500" />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">Order Confirmed!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-2">
            Thank you, {info.firstName || 'Sneakerhead'}! Your order has been placed.
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Order <span className="font-bold text-neutral-900 dark:text-white">#RK{Date.now().toString().slice(-6)}</span> — Confirmation sent to {info.email || 'your email'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('order-tracking')}
              className="w-full btn-primary py-4"
            >
              Track Your Order
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="w-full btn-secondary py-4"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Your cart is empty</p>
          <button onClick={() => onNavigate('catalog')} className="btn-primary">Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('catalog')}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center mb-10 overflow-x-auto pb-2">
          {steps.map(({ id, label }, i) => (
            <React.Fragment key={id}>
              <button
                onClick={() => i < stepIndex && setStep(id)}
                className={`flex items-center gap-2 flex-shrink-0 transition-colors ${
                  i === stepIndex
                    ? 'text-neutral-900 dark:text-white'
                    : i < stepIndex
                    ? 'text-success-600 dark:text-success-400 cursor-pointer hover:text-success-700'
                    : 'text-neutral-400 dark:text-neutral-600 cursor-default'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0 ${
                  i < stepIndex
                    ? 'bg-success-500 text-white'
                    : i === stepIndex
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                }`}>
                  {i < stepIndex ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{label}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-700 mx-3 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-card dark:shadow-card-dark">
              {/* Step 1: Info */}
              {step === 'info' && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-primary-500" /> Contact Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={info.firstName}
                        onChange={(e) => setInfo((p) => ({ ...p, firstName: e.target.value }))}
                        placeholder="John"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={info.lastName}
                        onChange={(e) => setInfo((p) => ({ ...p, lastName: e.target.value }))}
                        placeholder="Doe"
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Email</label>
                      <input
                        type="email"
                        value={info.email}
                        onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={info.phone}
                        onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+1 (555) 000-0000"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <button onClick={() => setStep('shipping')} className="w-full btn-primary mt-6 py-4 flex items-center justify-between">
                    Continue to Shipping <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 'shipping' && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                    <Truck size={20} className="text-primary-500" /> Shipping Address
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Address Line 1</label>
                      <input
                        type="text"
                        value={address.line1}
                        onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))}
                        placeholder="123 Main Street"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        value={address.line2}
                        onChange={(e) => setAddress((p) => ({ ...p, line2: e.target.value }))}
                        placeholder="Apt 4B"
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                          placeholder="New York"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">State</label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                          placeholder="NY"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">ZIP Code</label>
                        <input
                          type="text"
                          value={address.zip}
                          onChange={(e) => setAddress((p) => ({ ...p, zip: e.target.value }))}
                          placeholder="10001"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Country</label>
                        <input
                          type="text"
                          value={address.country}
                          onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-3">Shipping Method</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'standard', label: 'Standard Shipping', sub: '5-7 business days', price: subtotal >= 150 ? 'FREE' : '$14.99' },
                        { value: 'express', label: 'Express Shipping', sub: '2-3 business days', price: '$24.99' },
                        { value: 'overnight', label: 'Overnight Shipping', sub: 'Next business day', price: '$49.99' },
                      ].map(({ value, label, sub, price }) => (
                        <label key={value} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          shipping === value
                            ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                            : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700'
                        }`}>
                          <input
                            type="radio"
                            name="shipping"
                            value={value}
                            checked={shipping === value}
                            onChange={() => setShipping(value)}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-neutral-900 dark:text-white">{label}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{sub}</p>
                          </div>
                          <span className={`font-bold text-sm ${price === 'FREE' ? 'text-success-600 dark:text-success-400' : 'text-neutral-900 dark:text-white'}`}>{price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => setStep('payment')} className="w-full btn-primary py-4 flex items-center justify-between">
                    Continue to Payment <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-primary-500" /> Payment Method
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {([
                      { id: 'card', label: 'Credit Card', icon: '💳' },
                      { id: 'paypal', label: 'PayPal', icon: 'P' },
                      { id: 'apple', label: 'Apple Pay', icon: '' },
                      { id: 'google', label: 'Google Pay', icon: 'G' },
                    ] as const).map(({ id, label, icon }) => (
                      <button
                        key={id}
                        onClick={() => setPayment(id)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          payment === id
                            ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                            : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-2xl">{icon}</span>
                        <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-1">{label}</p>
                      </button>
                    ))}
                  </div>

                  {payment === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Card Number</label>
                        <input
                          type="text"
                          value={card.number}
                          onChange={(e) => setCard((p) => ({ ...p, number: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="input-field font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          value={card.name}
                          onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                          placeholder="JOHN DOE"
                          className="input-field"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            value={card.expiry}
                            onChange={(e) => setCard((p) => ({ ...p, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="input-field font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">CVV</label>
                          <input
                            type="text"
                            value={card.cvv}
                            onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))}
                            placeholder="123"
                            maxLength={4}
                            className="input-field font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(payment === 'paypal' || payment === 'apple' || payment === 'google') && (
                    <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800 rounded-2xl mb-6">
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">You'll be redirected to complete payment with {payment.charAt(0).toUpperCase() + payment.slice(1)}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                    <Lock size={14} />
                    <span>Your payment info is encrypted and secure</span>
                  </div>

                  <button onClick={() => setStep('review')} className="w-full btn-primary py-4 flex items-center justify-between">
                    Review Order <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 'review' && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Review Order</h2>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Size {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}</p>
                        </div>
                        <span className="font-black text-sm text-neutral-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Address summary */}
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl mb-6 text-sm">
                    <p className="font-bold text-neutral-900 dark:text-white mb-1">{info.firstName} {info.lastName}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">{address.city}, {address.state} {address.zip}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">{address.country}</p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        Place Order — ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-card dark:shadow-card-dark sticky top-24">
              <h2 className="font-bold text-neutral-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-400">Size {item.selectedSize}</p>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 border-t border-neutral-100 dark:border-neutral-800 pt-4 text-sm">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-success-600 font-semibold' : ''}>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-lg text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                <Lock size={12} />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
