import React, { useState } from 'react';
import { Package, Truck, CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react';

interface OrderTrackingPageProps {
  onNavigate: (page: string) => void;
}

const timeline = [
  { id: 'confirmed', label: 'Order Confirmed', desc: 'Your order has been placed and confirmed', icon: CheckCircle, done: true, date: 'Jun 1, 10:23 AM' },
  { id: 'processing', label: 'Processing', desc: 'Your order is being prepared and authenticated', icon: Package, done: true, date: 'Jun 1, 2:45 PM' },
  { id: 'packed', label: 'Packed', desc: 'Your sneakers are packed and ready to ship', icon: Package, done: true, date: 'Jun 2, 9:10 AM' },
  { id: 'shipped', label: 'Shipped', desc: 'Your package is on the way', icon: Truck, done: true, date: 'Jun 2, 3:30 PM' },
  { id: 'out_for_delivery', label: 'Out for Delivery', desc: 'Your package is out for delivery today', icon: MapPin, done: false, date: 'Expected Jun 4' },
  { id: 'delivered', label: 'Delivered', desc: 'Package delivered to your address', icon: CheckCircle, done: false, date: '' },
];

export default function OrderTrackingPage({ onNavigate }: OrderTrackingPageProps) {
  const [trackingNumber, setTrackingNumber] = useState('RK283641');
  const [searched, setSearched] = useState(true);
  const activeStep = timeline.findIndex((s) => !s.done);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Track Order</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 text-sm">Real-time order tracking</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter order ID or tracking number"
              className="input-field flex-1"
            />
            <button
              onClick={() => setSearched(true)}
              className="btn-primary px-6"
            >
              Track
            </button>
          </div>
        </div>

        {searched && (
          <>
            {/* Order Info */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Order ID</p>
                  <p className="font-black text-xl text-neutral-900 dark:text-white">#{trackingNumber}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Placed on June 1, 2026</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-neutral-900 dark:text-white">1Z999AA10123456784</p>
                  <p className="text-xs text-neutral-400 mt-1">UPS</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Estimated Delivery</p>
                  <p className="font-bold text-success-600 dark:text-success-400">June 4, 2026</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={12} className="text-neutral-400" />
                    <span className="text-xs text-neutral-400">By end of day</span>
                  </div>
                </div>
                <div className="bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400 font-bold text-sm px-4 py-2 rounded-xl">
                  On Track
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark mb-6">
              <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Items in This Order</h3>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden">
                  <img src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Sneaker" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 dark:text-white">Air Jordan 1 Retro High OG</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Size 10 · Red/Black · Qty 1</p>
                  <p className="font-black text-neutral-900 dark:text-white mt-1">$180.00</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-card dark:shadow-card-dark">
              <h3 className="font-bold text-neutral-900 dark:text-white mb-8">Tracking Timeline</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className="w-full bg-neutral-900 dark:bg-white transition-all duration-1000"
                    style={{ height: `${(timeline.filter((s) => s.done).length / (timeline.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="space-y-8">
                  {timeline.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === activeStep;
                    return (
                      <div key={step.id} className={`flex gap-6 relative ${!step.done && !isActive ? 'opacity-40' : ''}`}>
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          step.done
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                            : isActive
                            ? 'bg-accent-500 text-white animate-pulse-slow'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 pt-2.5">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <p className={`font-bold text-base ${step.done || isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                                {step.label}
                                {isActive && <span className="ml-2 text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full font-semibold">Current</span>}
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{step.desc}</p>
                            </div>
                            {step.date && (
                              <span className={`text-xs font-semibold flex-shrink-0 ${step.done ? 'text-neutral-500 dark:text-neutral-400' : 'text-accent-500'}`}>
                                {step.date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
