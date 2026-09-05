import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductGrid: React.FC = () => {
  const {
    products,
    activeCategoryFilter,
    setActiveCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract unique fit types
  const fitOptions = useMemo(() => {
    const fits = new Set<string>();
    products.forEach((p) => {
      if (p.fit) fits.add(p.fit);
    });
    return Array.from(fits);
  }, [products]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category
      if (activeCategoryFilter !== 'all' && product.category !== activeCategoryFilter) {
        return false;
      }

      // 2. Search query (supports name, nameBn, SKU, fabric, tag)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchNameBn = product.nameBn?.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        const matchFabric = product.fabric.toLowerCase().includes(query);
        const matchTag = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchNameBn && !matchSku && !matchFabric && !matchTag) {
          return false;
        }
      }

      // 3. In stock only
      if (inStockOnly) {
        const hasStock = product.variants.some((v) => v.stockQuantity > 0);
        if (!hasStock) return false;
      }

      // 4. Fit filter
      if (selectedFit !== 'all' && product.fit !== selectedFit) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, activeCategoryFilter, searchQuery, inStockOnly, selectedFit, sortBy]);

  const resetFilters = () => {
    setActiveCategoryFilter('all');
    setSearchQuery('');
    setInStockOnly(false);
    setSelectedFit('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    activeCategoryFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    inStockOnly ||
    selectedFit !== 'all';

  const categoryLabels: Record<string, string> = {
    all: 'সকল পোশাক',
    polo: 'পোলো টি-শার্ট',
    'winter-wear': 'উইন্টার কালেকশন',
    't-shirts': 'টি-শার্ট',
    shirts: 'ক্যাজুয়াল শার্ট',
    jeans: 'জিন্স ও ডেনিম',
    'casual-wear': 'কার্গো ও প্যান্ট',
  };

  const currentCategoryTitle = categoryLabels[activeCategoryFilter] || 'সকল পোশাক';

  return (
    <section id="shop-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-950" />
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
              প্রিমিয়াম মেনসওয়্যার কালেকশন
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-1">
            {currentCategoryTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            মোট {filteredProducts.length}টি প্রিমিয়াম পোশাক প্রদর্শিত হচ্ছে
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Fit Filter dropdown */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 font-medium">ফিটিং:</span>
            <select
              value={selectedFit}
              onChange={(e) => setSelectedFit(e.target.value)}
              className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-900"
            >
              <option value="all">সকল ফিটিং</option>
              {fitOptions.map((fit) => (
                <option key={fit} value={fit}>
                  {fit}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              inStockOnly
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                inStockOnly ? 'bg-white border-white text-neutral-900' : 'border-neutral-400'
              }`}
            >
              {inStockOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>মজুত আছে কেবল</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-900"
            >
              <option value="featured">সাজেশন: বাছাইকৃত</option>
              <option value="newest">সর্বশেষ সংযোজন</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
              <option value="rating">সেরা রেটিং প্রাপ্ত</option>
            </select>
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-neutral-100 rounded-lg border border-neutral-200 text-neutral-800"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>ফিল্টার</span>
          </button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-neutral-500">সক্রিয় ফিল্টার:</span>
          {activeCategoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold">
              ক্যাটাগরি: {currentCategoryTitle}
              <button onClick={() => setActiveCategoryFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold">
              অনুসন্ধান: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold">
              মজুত আছে কেবল
              <button onClick={() => setInStockOnly(false)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedFit !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold">
              ফিটিং: {selectedFit}
              <button onClick={() => setSelectedFit('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-neutral-900 underline hover:text-neutral-600 ml-1"
          >
            সব রিসেট করুন
          </button>
        </div>
      )}

      {/* Mobile Filters Dropdown Bar */}
      {mobileFiltersOpen && (
        <div className="sm:hidden mb-6 p-4 bg-neutral-100 rounded-xl border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-900 uppercase">ফিল্টার সমূহ</h4>
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">ফিটিং ও সাইজ কাট</label>
            <select
              value={selectedFit}
              onChange={(e) => setSelectedFit(e.target.value)}
              className="w-full bg-white border border-neutral-300 text-xs rounded-lg p-2"
            >
              <option value="all">সকল ফিটিং</option>
              {fitOptions.map((fit) => (
                <option key={fit} value={fit}>{fit}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-neutral-800 font-medium">কেবলমাত্র স্টক থাকা পণ্য</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950"
            />
          </div>
        </div>
      )}

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">কোনো পণ্য খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            আপনার নির্বাচিত ফিল্টার বা অনুসন্ধানের সাথে মিলে এমন কোনো পণ্য বর্তমানে তালিকায় নেই।
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
          >
            সকল ফিল্টার মুছুন
          </button>
        </div>
      )}
    </section>
  );
};
