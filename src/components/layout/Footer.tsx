import React from 'react';
import { Instagram, Twitter, Youtube, Facebook, Mail, ArrowRight, Shield, Truck, RefreshCw, Star } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-white">
      {/* Trust Badges */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: '100% Authentic', desc: 'Every sneaker verified by experts' },
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $150' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
              { icon: Star, title: 'Loyalty Rewards', desc: 'Earn points on every purchase' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-neutral-300" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-neutral-900 font-black text-sm">RK</span>
              </div>
              <span className="font-black text-xl tracking-tighter">RAFAY KICKS</span>
            </button>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-xs">
              The world's premier sneaker marketplace. Authenticated, curated, and delivered to your door. Own the future of streetwear.
            </p>

            {/* Newsletter */}
            <div>
              <p className="font-semibold text-sm mb-3">Stay in the loop</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <button className="px-4 py-3 bg-white text-neutral-900 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <button key={i} className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all duration-200 hover:scale-110">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Shop',
              links: [
                { label: 'All Sneakers', page: 'catalog' },
                { label: 'New Arrivals', page: 'catalog' },
                { label: 'Trending', page: 'catalog' },
                { label: 'Limited Editions', page: 'catalog' },
                { label: 'Sale', page: 'catalog' },
              ],
            },
            {
              title: 'Account',
              links: [
                { label: 'Sign In', page: 'auth' },
                { label: 'My Orders', page: 'dashboard' },
                { label: 'Wishlist', page: 'dashboard' },
                { label: 'Track Order', page: 'order-tracking' },
                { label: 'Rewards', page: 'dashboard' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', page: 'home' },
                { label: 'Careers', page: 'home' },
                { label: 'Press', page: 'home' },
                { label: 'Affiliates', page: 'home' },
                { label: 'Contact', page: 'home' },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-300 mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map(({ label, page }) => (
                  <li key={label}>
                    <button
                      onClick={() => onNavigate(page)}
                      className="text-neutral-500 hover:text-white text-sm transition-colors duration-200"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-xs">
            © 2026 RAFAY KICKS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <button key={item} className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {['Visa', 'MC', 'AmEx', 'PayPal'].map((card) => (
              <span key={card} className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded font-mono">
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
