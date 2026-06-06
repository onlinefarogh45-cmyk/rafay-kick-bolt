import React, { useState } from 'react';
import { User, ShoppingBag, Heart, MapPin, CreditCard, Bell, Shield, LogOut, Star, ChevronRight, Package, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface DashboardPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

type DashboardTab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'payment' | 'notifications' | 'security';

const tabs: { id: DashboardTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const mockOrders = [
  { id: 'RK283641', date: 'May 28, 2026', status: 'delivered', items: 2, total: 360, product: 'Air Jordan 1 Retro', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'RK192847', date: 'May 15, 2026', status: 'shipped', items: 1, total: 190, product: 'Adidas Ultraboost 22', image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'RK104729', date: 'Apr 30, 2026', status: 'processing', items: 1, total: 220, product: 'Yeezy Boost 350 V2', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'RK093412', date: 'Apr 12, 2026', status: 'delivered', items: 3, total: 455, product: '+2 more', image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

const statusColors: Record<string, string> = {
  delivered: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400',
  shipped: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400',
  processing: 'bg-warning-100 dark:bg-warning-500/20 text-warning-700 dark:text-warning-400',
  cancelled: 'bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-400',
};

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, logout } = useAuth();
  const { items: wishlistItems, removeItem: removeWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Please sign in to access your dashboard</p>
          <button onClick={() => onNavigate('auth')} className="btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white">My Account</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Manage your profile, orders, and preferences</p>
          </div>
          <button
            onClick={() => { logout(); onNavigate('home'); }}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-error-500 dark:hover:text-error-400 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        {/* Loyalty Card */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6 mb-8 text-white flex items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-black">
              {initials}
            </div>
            <div>
              <p className="font-black text-lg">{user.name}</p>
              <p className="text-white/60 text-sm">{user.email}</p>
              <span className={`inline-flex items-center gap-1 mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-accent-500/30 text-accent-300' : 'bg-white/10 text-white/70'}`}>
                {user.role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
          </div>
          <div className="text-right relative z-10">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <Award size={18} className="text-warning-400" />
              <span className="font-black text-2xl">{user.loyaltyPoints.toLocaleString()}</span>
            </div>
            <p className="text-white/60 text-xs">Loyalty Points</p>
            <div className="w-32 h-1.5 bg-white/20 rounded-full mt-2">
              <div className="h-full bg-warning-400 rounded-full" style={{ width: `${Math.min((user.loyaltyPoints / 5000) * 100, 100)}%` }} />
            </div>
            <p className="text-white/40 text-[10px] mt-1">{5000 - user.loyaltyPoints} pts to Gold</p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === id
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Tab Menu */}
          <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4 w-full flex-shrink-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Profile Information</h2>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                    {initials}
                  </div>
                  <div>
                    <button className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">Change Photo</button>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: '+1 (555) 234-5678' },
                    { label: 'Member Since', value: user.joinedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">{label}</label>
                      <input defaultValue={value} className="input-field text-sm" />
                    </div>
                  ))}
                </div>
                <button className="btn-primary mt-6 text-sm px-6 py-2.5">Save Changes</button>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Order History</h2>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer" onClick={() => onNavigate('order-tracking')}>
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">#{order.id}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{order.product} {order.items > 1 ? `+ ${order.items - 1} more` : ''}</p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">{order.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-neutral-900 dark:text-white">${order.total}</p>
                        <ChevronRight size={16} className="text-neutral-400 ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={40} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400">No saved items yet</p>
                    <button onClick={() => onNavigate('catalog')} className="btn-primary mt-4 text-sm px-6 py-2.5">Browse Sneakers</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((p) => (
                      <div key={p.id} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => onNavigate('product', p.id)}>
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-400 font-semibold">{p.brand}</p>
                          <p className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 mt-0.5">{p.name}</p>
                          <p className="font-black text-neutral-900 dark:text-white mt-1">${p.price}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => onNavigate('product', p.id)}
                              className="text-xs font-bold text-primary-500 hover:text-primary-600"
                            >
                              View
                            </button>
                            <button
                              onClick={() => removeWishlist(p.id)}
                              className="text-xs font-bold text-error-500 hover:text-error-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Saved Addresses</h2>
                  <button className="text-sm font-semibold text-primary-500 hover:text-primary-600">+ Add New</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: user.name, line1: '123 Kicks Ave', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
                    { name: user.name, line1: '456 Sneaker Blvd', city: 'Brooklyn', state: 'NY', zip: '11201', isDefault: false },
                  ].map((addr, i) => (
                    <div key={i} className={`p-4 rounded-2xl border-2 ${addr.isDefault ? 'border-neutral-900 dark:border-white' : 'border-neutral-100 dark:border-neutral-700'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white">{addr.name}</span>
                        {addr.isDefault && <span className="text-[10px] font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 rounded-full">DEFAULT</span>}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{addr.line1}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{addr.city}, {addr.state} {addr.zip}</p>
                      <div className="flex gap-3 mt-3">
                        <button className="text-xs font-semibold text-primary-500">Edit</button>
                        {!addr.isDefault && <button className="text-xs font-semibold text-error-500">Delete</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === 'payment' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Payment Methods</h2>
                  <button className="text-sm font-semibold text-primary-500 hover:text-primary-600">+ Add Card</button>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'Visa', last4: '4242', expiry: '12/27', isDefault: true },
                    { type: 'Mastercard', last4: '8763', expiry: '08/26', isDefault: false },
                  ].map((card, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${card.isDefault ? 'border-neutral-900 dark:border-white' : 'border-neutral-100 dark:border-neutral-700'}`}>
                      <div className="w-12 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-xs text-neutral-600 dark:text-neutral-400">{card.type}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-neutral-900 dark:text-white">•••• •••• •••• {card.last4}</p>
                        <p className="text-xs text-neutral-400">Expires {card.expiry}</p>
                      </div>
                      {card.isDefault && <span className="text-[10px] font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 rounded-full">DEFAULT</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Order Updates', desc: 'Shipping confirmations, delivery notifications', checked: true },
                    { label: 'New Drop Alerts', desc: 'Be the first to know about limited releases', checked: true },
                    { label: 'Price Drops', desc: 'Alerts when wishlisted items go on sale', checked: true },
                    { label: 'Flash Sales', desc: 'Time-sensitive discount notifications', checked: false },
                    { label: 'Newsletter', desc: 'Weekly sneaker culture and editorial content', checked: false },
                  ].map(({ label, desc, checked }) => (
                    <label key={label} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <div>
                        <p className="font-semibold text-sm text-neutral-900 dark:text-white">{label}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{desc}</p>
                      </div>
                      <div className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white dark:bg-neutral-900 rounded-full transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <button className="btn-primary text-sm px-6 py-2.5">Update Password</button>

                  <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
                      <div>
                        <p className="font-semibold text-sm text-neutral-900 dark:text-white">Authenticator App</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Extra layer of account security</p>
                      </div>
                      <button className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin quick access */}
        {user.role === 'admin' && (
          <div className="mt-8 p-4 bg-accent-50 dark:bg-accent-500/10 border border-accent-200 dark:border-accent-500/20 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-accent-700 dark:text-accent-400 text-sm">Admin Panel Available</p>
              <p className="text-xs text-accent-500 dark:text-accent-500 mt-0.5">Manage products, orders, and customers</p>
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="bg-accent-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-accent-600 transition-colors"
            >
              Open Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
