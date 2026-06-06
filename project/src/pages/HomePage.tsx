import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Star, TrendingUp, Zap, Award, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

const heroSlides = [
  {
    headline: 'Own The Future',
    subline: 'Of Streetwear',
    description: 'Shop the rarest, most coveted sneakers. Authenticated, verified, delivered.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    accent: 'from-blue-900/80',
  },
  {
    headline: 'Drop Day',
    subline: 'Every Day',
    description: 'Exclusive limited editions and new arrivals added daily. Be first.',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600',
    accent: 'from-neutral-900/80',
  },
  {
    headline: 'Authenticated',
    subline: 'Every Step',
    description: 'Every sneaker is verified by our team of expert authenticators.',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1600',
    accent: 'from-red-900/70',
  },
];

const stats = [
  { label: 'Verified Pairs', value: '2.4M+' },
  { label: 'Happy Customers', value: '500K+' },
  { label: 'Brands', value: '200+' },
  { label: 'Daily Drops', value: '50+' },
];

const flashSaleEnd = new Date(Date.now() + 8 * 60 * 60 * 1000);

function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 8, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = flashSaleEnd.getTime() - Date.now();
      if (diff <= 0) { clearInterval(interval); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
        <React.Fragment key={i}>
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl px-3 py-2 text-center min-w-[52px]">
            <span className="text-2xl font-black tabular-nums">{String(val).padStart(2, '0')}</span>
            <p className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">{['HRS', 'MIN', 'SEC'][i]}</p>
          </div>
          {i < 2 && <span className="text-2xl font-black text-neutral-900 dark:text-white">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();

  const featuredProducts = products.filter((p) => p.badge).slice(0, 8);
  const trendingProducts = products.filter((p) => p.badge === 'trending' || p.rating >= 4.8).slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === 'new').slice(0, 4);
  const saleProducts = products.filter((p) => p.discount && p.discount > 15).slice(0, 4);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, heroIndex]);

  const handleHeroNav = (dir: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    setHeroIndex((prev) => (dir === 'next' ? (prev + 1) % heroSlides.length : (prev - 1 + heroSlides.length) % heroSlides.length));
  };

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="bg-white dark:bg-neutral-950">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover scale-110"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} via-black/50 to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              {/* Label */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-up">
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-semibold uppercase tracking-widest">New Drops Available</span>
              </div>

              {/* Headline */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-fade-up">
                {currentSlide.headline}
                <br />
                <span className="text-gradient">{currentSlide.subline}</span>
              </h1>

              <p className="text-white/70 text-lg mt-6 mb-8 max-w-md leading-relaxed animate-fade-up">
                {currentSlide.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 animate-fade-up">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 font-bold rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
                >
                  <Play size={16} fill="currentColor" />
                  Explore Collection
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 animate-fade-up">
                {stats.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-white/50 text-xs uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-end gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleHeroNav('prev')}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleHeroNav('next')}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setHeroIndex(i); setIsAutoPlaying(false); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-10">
          {[
            { label: 'Just Dropped', sub: 'Air Jordan 1 Retro', badge: 'NEW' },
            { label: 'Selling Fast', sub: 'Yeezy 350 V2', badge: 'HOT' },
          ].map(({ label, sub, badge }) => (
            <button
              key={sub}
              onClick={() => onNavigate('catalog')}
              className="glass rounded-2xl px-4 py-3 text-left hover:bg-white/20 transition-colors animate-float"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-accent-400 bg-accent-500/20 rounded-full px-2 py-0.5">{badge}</span>
                <span className="text-white/60 text-[10px]">{label}</span>
              </div>
              <p className="text-white text-sm font-bold">{sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-100 dark:border-neutral-800 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {['Nike', 'Jordan', 'Adidas', 'New Balance', 'Converse', 'Vans'].map((brand) => (
              <button
                key={brand}
                onClick={() => onNavigate('catalog')}
                className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-black text-xl tracking-tighter transition-colors duration-200"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="bg-neutral-900 dark:bg-neutral-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black text-white tracking-tight">Flash Sale</h2>
                  <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">UP TO 37% OFF</span>
                </div>
                <p className="text-neutral-400 text-sm mt-1">Limited time offer. Don't miss out.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-neutral-400">
                <Timer size={16} />
                <span className="text-sm font-semibold">Ends in:</span>
              </div>
              <FlashSaleCountdown />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} onView={(id) => onNavigate('product', id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-accent-500" />
                <span className="text-accent-500 text-sm font-bold uppercase tracking-wider">Hot Right Now</span>
              </div>
              <h2 className="section-title">Trending Kicks</h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} onView={(id) => onNavigate('product', id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Full Width Banner */}
      <section className="py-8 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onClick={() => onNavigate('catalog')}
            className="relative rounded-3xl overflow-hidden cursor-pointer group h-80 md:h-96"
          >
            <img
              src="https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="New Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center p-10 md:p-16">
              <div>
                <span className="inline-block bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                  Summer 2026 Collection
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-4">
                  New Season.<br />New Drip.
                </h2>
                <button className="inline-flex items-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-neutral-100 transition-colors text-sm">
                  Shop Collection <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span className="text-success-600 dark:text-success-500 text-sm font-bold uppercase tracking-wider">Fresh Drop</span>
              </div>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} onView={(id) => onNavigate('product', id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why RAFAY KICKS?</h2>
            <p className="section-subtitle">The premium sneaker experience you deserve</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: '100% Authenticated',
                desc: 'Every pair goes through our rigorous 10-point authentication process by certified sneaker experts.',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                iconBg: 'bg-primary-500',
              },
              {
                icon: Zap,
                title: 'Instant Buy & Sell',
                desc: 'List or purchase in seconds. Our marketplace moves as fast as the culture.',
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                iconBg: 'bg-accent-500',
              },
              {
                icon: Star,
                title: 'Loyalty Rewards',
                desc: 'Earn points on every purchase. Redeem for discounts, early access, and exclusive drops.',
                bg: 'bg-green-50 dark:bg-green-900/20',
                iconBg: 'bg-success-600',
              },
            ].map(({ icon: Icon, title, desc, bg, iconBg }) => (
              <div key={title} className={`${bg} rounded-3xl p-8 hover:scale-105 transition-transform duration-300 cursor-default`}>
                <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-5`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex">
                {[1,2,3,4,5].map((s) => <Star key={s} size={20} className="text-warning-500 fill-warning-500" />)}
              </div>
              <span className="font-bold text-neutral-900 dark:text-white">4.9</span>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">/ 500K+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Marcus T.', avatar: 'MT', rating: 5, review: 'RAFAY KICKS is the only place I trust for authentic heat. Got my Jordan 11s in 2 days, perfectly authenticated. This is the future of sneaker shopping.', product: 'Jordan 11 Retro Bred', verified: true },
              { name: 'Sofia R.', avatar: 'SR', rating: 5, review: 'The app experience is insane. Clean UI, fast checkout, and the authentication certificate gave me full confidence. Already ordered 3 pairs!', product: 'Yeezy Boost 350 V2', verified: true },
              { name: 'James K.', avatar: 'JK', rating: 5, review: "Best sneaker platform period. StockX can't compare — the prices are better, shipping is faster, and customer service is actually helpful.", product: 'Nike Dunk Low Retro', verified: true },
            ].map(({ name, avatar, rating, review, product, verified }) => (
              <div key={name} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-card dark:shadow-card-dark">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-neutral-900 dark:text-white text-sm">{name}</p>
                      {verified && <span className="text-[10px] bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400 font-bold px-2 py-0.5 rounded-full">VERIFIED</span>}
                    </div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">{product}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[1,2,3,4,5].map((s) => <Star key={s} size={12} className={s <= rating ? 'text-warning-500 fill-warning-500' : 'text-neutral-300'} />)}
                  </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">"{review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations Banner */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="inline-block bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                  AI-Powered
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Your Personal<br />Sneaker Stylist</h2>
                <p className="text-white/60 max-w-md text-sm leading-relaxed">
                  Our AI learns your style, size, and preferences to surface the most relevant drops before anyone else.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="grid grid-cols-2 gap-2">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="w-24 h-24 bg-neutral-700 rounded-2xl overflow-hidden">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-80" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="bg-white text-neutral-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-100 transition-colors flex items-center gap-2"
                >
                  Get Recommendations <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Product Grid */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">Featured Drops</h2>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn-secondary text-sm py-2 px-5"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onView={(id) => onNavigate('product', id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty CTA */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Award size={30} className="text-white" />
          </div>
          <h2 className="section-title mb-4">Join The Kicks Club</h2>
          <p className="section-subtitle max-w-xl mx-auto mb-8">
            Earn points, unlock exclusive drops, and get early access to the most hyped releases. Over 500K members already inside.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('auth')}
              className="btn-primary px-8 py-4 text-base"
            >
              Create Account — It's Free
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn-secondary px-8 py-4 text-base"
            >
              Shop as Guest
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
