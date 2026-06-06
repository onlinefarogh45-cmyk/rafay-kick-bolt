import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Sun, Moon, Menu, X, User, ChevronDown, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navLinks = [
  { label: 'Shop', page: 'catalog', hasDropdown: true },
  { label: 'New Arrivals', page: 'catalog' },
  { label: 'Trending', page: 'catalog' },
  { label: 'Brands', page: 'catalog' },
];

const brandDropdown = ['Nike', 'Jordan', 'Adidas', 'New Balance', 'Converse', 'Vans'];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { totalItems, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = currentPage === 'home';

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-neutral-900 dark:bg-neutral-950 text-white text-center py-2 text-xs font-medium tracking-wide">
        <span className="flex items-center justify-center gap-2">
          <Zap size={12} className="text-accent-400" />
          FREE SHIPPING ON ORDERS OVER $150 — USE CODE: RAFAY15 FOR 15% OFF
          <Zap size={12} className="text-accent-400" />
        </span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-sm border-b border-neutral-100 dark:border-neutral-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-neutral-900 dark:bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white dark:text-neutral-900 font-black text-sm">RK</span>
              </div>
              <span
                className={`font-black text-xl tracking-tighter transition-colors duration-300 ${
                  isScrolled || !isHomePage
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-white'
                }`}
              >
                RAFAY KICKS
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.hasDropdown ? (
                    <button
                      onMouseEnter={() => setShopDropdownOpen(true)}
                      onMouseLeave={() => setShopDropdownOpen(false)}
                      onClick={() => onNavigate(link.page)}
                      className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 hover:text-primary-500 ${
                        isScrolled || !isHomePage
                          ? 'text-neutral-700 dark:text-neutral-300'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate(link.page)}
                      className={`text-sm font-semibold transition-colors duration-200 hover:text-primary-500 ${
                        isScrolled || !isHomePage
                          ? 'text-neutral-700 dark:text-neutral-300'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </button>
                  )}

                  {link.hasDropdown && shopDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 p-2 animate-fade-in"
                      onMouseEnter={() => setShopDropdownOpen(true)}
                      onMouseLeave={() => setShopDropdownOpen(false)}
                    >
                      {brandDropdown.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => { onNavigate('catalog'); setShopDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl font-medium transition-colors"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isScrolled || !isHomePage
                    ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isScrolled || !isHomePage
                    ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => onNavigate('dashboard')}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 relative ${
                  isScrolled || !isHomePage
                    ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 relative ${
                  isScrolled || !isHomePage
                    ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              <button
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isScrolled || !isHomePage
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200'
                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                <User size={16} />
                {isAuthenticated ? user?.name.split(' ')[0] : 'Sign In'}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all ${
                  isScrolled || !isHomePage
                    ? 'text-neutral-700 dark:text-neutral-300'
                    : 'text-white'
                }`}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => { onNavigate(isAuthenticated ? 'dashboard' : 'auth'); setMobileOpen(false); }}
                  className="w-full btn-primary py-2.5 text-sm"
                >
                  {isAuthenticated ? `Hi, ${user?.name.split(' ')[0]}` : 'Sign In / Sign Up'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4 p-6">
              <Search size={22} className="text-neutral-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search for sneakers, brands, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { onNavigate('catalog'); setSearchOpen(false); }
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                className="flex-1 text-lg bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
              />
              <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="px-6 pb-6 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Air Jordan 1', 'Nike Dunk', 'Yeezy 350', 'Air Max 90', 'New Balance'].map((term) => (
                  <button
                    key={term}
                    onClick={() => { onNavigate('catalog'); setSearchOpen(false); }}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
