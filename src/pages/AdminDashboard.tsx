import React, { useState } from 'react';
import {
  BarChart2, ShoppingBag, Users, Package, TrendingUp, ArrowUp, ArrowDown,
  Plus, Edit2, Trash2, Search, MoreVertical, Eye, Download
} from 'lucide-react';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type AdminTab = 'overview' | 'products' | 'orders' | 'customers';

const stats = [
  { label: 'Total Revenue', value: '$284,920', change: '+12.5%', up: true, icon: BarChart2, color: 'bg-primary-500' },
  { label: 'Total Orders', value: '4,821', change: '+8.2%', up: true, icon: ShoppingBag, color: 'bg-accent-500' },
  { label: 'Customers', value: '12,049', change: '+18.7%', up: true, icon: Users, color: 'bg-success-600' },
  { label: 'Products', value: '238', change: '-2.1%', up: false, icon: Package, color: 'bg-warning-500' },
];

const recentOrders = [
  { id: 'RK283641', customer: 'Marcus T.', product: 'Air Jordan 1', status: 'delivered', amount: '$360', date: 'Jun 1' },
  { id: 'RK192847', customer: 'Sofia R.', product: 'Yeezy 350 V2', status: 'shipped', amount: '$440', date: 'Jun 2' },
  { id: 'RK104729', customer: 'James K.', product: 'Nike Dunk Low', status: 'processing', amount: '$110', date: 'Jun 3' },
  { id: 'RK093412', customer: 'Taylor M.', product: 'New Balance 990v5', status: 'confirmed', amount: '$185', date: 'Jun 3' },
  { id: 'RK084123', customer: 'Alex P.', product: 'Jordan 11 Bred', status: 'delivered', amount: '$220', date: 'Jun 3' },
];

const statusColors: Record<string, string> = {
  delivered: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400',
  shipped: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400',
  processing: 'bg-warning-100 dark:bg-warning-500/20 text-warning-700 dark:text-warning-400',
  confirmed: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400',
};

const barData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 90 },
  { label: 'Apr', value: 74 },
  { label: 'May', value: 95 },
  { label: 'Jun', value: 85 },
];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [productSearch, setProductSearch] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Admin access required</p>
          <button onClick={() => onNavigate('home')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-secondary text-sm py-2.5"
            >
              My Account
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1 mb-8 overflow-x-auto">
          {(['overview', 'products', 'orders', 'customers'] as AdminTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 min-w-fit px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                tab === t
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map(({ label, value, change, up, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-card dark:shadow-card-dark">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className={`text-xs font-bold flex items-center gap-1 ${up ? 'text-success-600 dark:text-success-400' : 'text-error-500'}`}>
                      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {change}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">{value}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Chart + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white">Revenue Overview</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Monthly revenue in thousands</p>
                  </div>
                  <select className="text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 bg-transparent text-neutral-600 dark:text-neutral-400">
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {barData.map(({ label, value }) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className="w-full bg-neutral-900 dark:bg-white rounded-t-lg transition-all duration-700 hover:bg-primary-500 dark:hover:bg-primary-400 cursor-pointer relative group"
                        style={{ height: `${value}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${value}K
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Top Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="text-xs font-black text-neutral-400 w-4">{i + 1}</span>
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">{p.reviewCount} sold</p>
                      </div>
                      <span className="text-xs font-black text-neutral-900 dark:text-white">${p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-neutral-900 dark:text-white">Recent Orders</h3>
                <button
                  onClick={() => setTab('orders')}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-3">Order</th>
                      <th className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-3">Customer</th>
                      <th className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-3 hidden sm:table-cell">Product</th>
                      <th className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-3">Status</th>
                      <th className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <td className="py-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">#{order.id}</td>
                        <td className="py-3 font-semibold text-neutral-900 dark:text-white">{order.customer}</td>
                        <td className="py-3 text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">{order.product}</td>
                        <td className="py-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
                        </td>
                        <td className="py-3 font-black text-neutral-900 dark:text-white text-right">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Management */}
        {tab === 'products' && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
            <div className="p-6 border-b border-neutral-50 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h2 className="font-bold text-neutral-900 dark:text-white text-lg flex-1">Products ({products.length})</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
                <button className="flex items-center gap-2 btn-primary text-sm py-2.5 whitespace-nowrap">
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left">
                    <th className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-6 py-4">Product</th>
                    <th className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Brand</th>
                    <th className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-4">Price</th>
                    <th className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-4 hidden sm:table-cell">Stock</th>
                    <th className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Rating</th>
                    <th className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-4">Status</th>
                    <th className="px-4 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-700 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-neutral-900 dark:text-white line-clamp-1 max-w-[160px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-neutral-500 dark:text-neutral-400 hidden md:table-cell">{p.brand}</td>
                      <td className="px-4 py-4 font-black text-neutral-900 dark:text-white">${p.price}</td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`text-xs font-bold ${p.stockCount && p.stockCount <= 5 ? 'text-error-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                          {p.inStock ? (p.stockCount ?? '—') : 'Out'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-xs">
                          ★ {p.rating} ({p.reviewCount.toLocaleString()})
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.inStock ? 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'}`}>
                          {p.inStock ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"><Eye size={14} /></button>
                          <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"><Edit2 size={14} /></button>
                          <button className="p-1.5 rounded-lg text-neutral-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
            <div className="p-6 border-b border-neutral-50 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white text-lg">Order Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left">
                    {['Order ID', 'Customer', 'Product', 'Date', 'Status', 'Amount', ''].map((h) => (
                      <th key={h} className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {recentOrders.concat(recentOrders).map((order, i) => (
                    <tr key={`${order.id}-${i}`} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">#{order.id}</td>
                      <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">{order.customer}</td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{order.product}</td>
                      <td className="px-6 py-4 text-neutral-400">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-neutral-900 dark:text-white">{order.amount}</td>
                      <td className="px-6 py-4">
                        <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers */}
        {tab === 'customers' && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
            <div className="p-6 border-b border-neutral-50 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white text-lg">Customer Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left">
                    {['Customer', 'Email', 'Orders', 'Total Spent', 'Loyalty Pts', 'Joined', ''].map((h) => (
                      <th key={h} className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {[
                    { name: 'Marcus Thompson', email: 'marcus@example.com', orders: 12, spent: '$2,840', points: 2840, joined: 'Jan 2024' },
                    { name: 'Sofia Rodriguez', email: 'sofia@example.com', orders: 8, spent: '$1,920', points: 1920, joined: 'Mar 2024' },
                    { name: 'James Kim', email: 'james@example.com', orders: 5, spent: '$880', points: 880, joined: 'Jun 2024' },
                    { name: 'Rafay Khan', email: 'rafay@example.com', orders: 24, spent: '$6,240', points: 6240, joined: 'Jan 2023' },
                    { name: 'Taylor Morgan', email: 'taylor@example.com', orders: 3, spent: '$455', points: 455, joined: 'May 2025' },
                  ].map((customer) => (
                    <tr key={customer.email} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-neutral-900 dark:text-white">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{customer.email}</td>
                      <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">{customer.orders}</td>
                      <td className="px-6 py-4 font-black text-neutral-900 dark:text-white">{customer.spent}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-warning-600 dark:text-warning-400">{customer.points.toLocaleString()} pts</span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 text-xs">{customer.joined}</td>
                      <td className="px-6 py-4">
                        <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
