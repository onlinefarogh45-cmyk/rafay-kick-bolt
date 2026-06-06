import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products, brands, categories, genders, allSizes } from '../data/products';
import type { FilterState } from '../types';

interface CatalogPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rated', value: 'rating' },
];

const defaultFilters: FilterState = {
  brands: [],
  sizes: [],
  colors: [],
  priceRange: [0, 500],
  categories: [],
  genders: [],
  availability: 'all',
  badge: 'all',
};

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-bold text-neutral-900 dark:text-white mb-3"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function CatalogPage({ onNavigate }: CatalogPageProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
      );
    }
    if (filters.brands.length) result = result.filter((p) => filters.brands.includes(p.brand));
    if (filters.categories.length) result = result.filter((p) => filters.categories.includes(p.category));
    if (filters.genders.length) result = result.filter((p) => filters.genders.includes(p.gender));
    if (filters.sizes.length) result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.availability === 'in_stock') result = result.filter((p) => p.inStock);
    if (filters.availability === 'out_of_stock') result = result.filter((p) => !p.inStock);
    if (filters.badge !== 'all') {
      if (filters.badge === 'none') result = result.filter((p) => !p.badge);
      else result = result.filter((p) => p.badge === filters.badge);
    }
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    switch (sortBy) {
      case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
    }

    return result;
  }, [filters, sortBy, searchQuery]);

  const toggleFilter = <K extends keyof FilterState>(key: K, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const activeFilterCount =
    filters.brands.length +
    filters.sizes.length +
    filters.categories.length +
    filters.genders.length +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.badge !== 'all' ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-0">
      <FilterSection title="Brand">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleFilter('brands', brand)}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleFilter('categories', cat)}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => toggleFilter('genders', g)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors capitalize ${
                filters.genders.includes(g)
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size (US)">
        <div className="grid grid-cols-4 gap-1.5">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleFilter('sizes', size)}
              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                filters.sizes.includes(size)
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold text-neutral-900 dark:text-white">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            value={filters.priceRange[1]}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
            className="w-full"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0] || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1] || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'In Stock', value: 'in_stock' },
            { label: 'Out of Stock', value: 'out_of_stock' },
          ].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === value}
                onChange={() => setFilters((prev) => ({ ...prev, availability: value }))}
                className="w-4 h-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Badge">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'New', value: 'new' },
            { label: 'Trending', value: 'trending' },
            { label: 'Limited', value: 'limited' },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilters((prev) => ({ ...prev, badge: value }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.badge === value
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Page Header */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">All Sneakers</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {products.length} authenticated pairs available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search sneakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
            />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors relative"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowUpDown size={16} />
              <span className="hidden sm:inline">{sortOptions.find((s) => s.value === sortBy)?.label}</span>
              <ChevronDown size={14} />
            </button>
            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 p-2 z-20 animate-fade-in">
                {sortOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => { setSortBy(value); setSortDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-colors ${
                      sortBy === value
                        ? 'bg-neutral-100 dark:bg-neutral-700 font-bold text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode */}
          <div className="hidden sm:flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Active filters:</span>
            {filters.brands.map((b) => (
              <button key={b} onClick={() => toggleFilter('brands', b)} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                {b} <X size={12} />
              </button>
            ))}
            {filters.categories.map((c) => (
              <button key={c} onClick={() => toggleFilter('categories', c)} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                {c} <X size={12} />
              </button>
            ))}
            {filters.sizes.map((s) => (
              <button key={s} onClick={() => toggleFilter('sizes', s)} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                Size {s} <X size={12} />
              </button>
            ))}
            <button
              onClick={() => setFilters(defaultFilters)}
              className="flex items-center gap-1.5 px-3 py-1 bg-error-100 dark:bg-error-500/20 text-error-600 dark:text-error-400 rounded-full text-xs font-semibold hover:bg-error-200 dark:hover:bg-error-500/30 transition-colors"
            >
              Clear All <X size={12} />
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-neutral-900 dark:text-white">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                <span className="font-bold text-neutral-900 dark:text-white">{filtered.length}</span> results
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👟</div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No sneakers found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">Try adjusting your filters</p>
                <button onClick={() => setFilters(defaultFilters)} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5'
                : 'space-y-4'
              }>
                {filtered.map((p) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={p.id} product={p} onView={(id) => onNavigate('product', id)} />
                  ) : (
                    <div
                      key={p.id}
                      onClick={() => onNavigate('product', p.id)}
                      className="flex gap-5 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-card dark:shadow-card-dark hover:shadow-card-hover cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="w-32 h-32 bg-neutral-50 dark:bg-neutral-700 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{p.brand}</p>
                        <h3 className="font-bold text-neutral-900 dark:text-white mt-0.5 text-lg">{p.name}</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-neutral-900 dark:text-white">${p.price}</span>
                            {p.originalPrice && <span className="text-sm text-neutral-400 line-through">${p.originalPrice}</span>}
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.inStock ? 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'}`}>
                            {p.inStock ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-fade-up">
            <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="font-bold text-neutral-900 dark:text-white text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <X size={20} className="text-neutral-500" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar />
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full btn-primary mt-4 py-3"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
