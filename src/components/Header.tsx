import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  Package,
  Award,
  Menu,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Ruler,
  HelpCircle,
  Phone,
  Facebook,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    activeCategoryFilter,
    setActiveCategoryFilter,
    loyalty,
    setIsLoyaltyOpen,
    setIsTrackingOpen,
    setIsSizeGuideOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showToast,
    products,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Close mobile drawer on Escape and lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Check low stock count across variants for admin badge
  const lowStockCount = products.reduce((total, p) => {
    return total + p.variants.filter((v) => v.stockQuantity > 0 && v.stockQuantity <= 3).length;
  }, 0);

  const categories = [
    { id: 'all', label: 'সকল কালেকশন', count: products.length },
    { id: 'polo', label: 'পোলো টি-শার্ট', count: products.filter((p) => p.category === 'polo').length },
    { id: 'winter-wear', label: 'উইন্টার কালেকশন', count: products.filter((p) => p.category === 'winter-wear').length },
    { id: 't-shirts', label: 'টি-শার্ট', count: products.filter((p) => p.category === 't-shirts').length },
    { id: 'shirts', label: 'ক্যাজুয়াল শার্ট', count: products.filter((p) => p.category === 'shirts').length },
    { id: 'jeans', label: 'জিন্স ও ডেনিম', count: products.filter((p) => p.category === 'jeans').length },
    { id: 'casual-wear', label: 'কার্গো ও প্যান্ট', count: products.filter((p) => p.category === 'casual-wear').length },
  ];

  const handleCategorySelect = (catId: string, label?: string) => {
    setViewMode('store');
    setActiveCategoryFilter(catId);
    setSearchQuery('');
    setIsMobileMenuOpen(false);

    // Smooth scroll down to the product catalog section
    setTimeout(() => {
      const catalogEl =
        document.getElementById('shop-catalog') ||
        document.getElementById('shop-catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);

    if (label && showToast) {
      showToast(`${label} কালেকশন লোড হয়েছে`, 'info');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-neutral-800 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900"
              aria-label={isMobileMenuOpen ? 'মেন্যু বন্ধ করুন' : 'মেন্যু খুলুন'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setViewMode('store');
                setActiveCategoryFilter('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              {/* Awesome Point AP mark */}
              <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm group-hover:bg-neutral-800 transition-colors">
                <span className="text-amber-400 font-extrabold mr-0.5">A</span>P
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-950 leading-none">
                    অসাম পয়েন্ট
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-neutral-500 mt-0.5">
                  Awesome Point • Dhaka
                </span>
              </div>
            </button>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="পোলো, উইন্টার জ্যাকেট, টি-শার্ট, জিন্স বা SKU খুঁজুন..."
                className="w-full bg-neutral-100/90 border border-neutral-200 text-neutral-900 text-sm rounded-full pl-10 pr-4 py-2 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  মুছুন
                </button>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* View Mode Switchers for easy review */}
            <button
              id="header-order-track-btn"
              onClick={() => setIsTrackingOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              title="অর্ডারের বর্তমান অবস্থা ট্র্যাক করুন"
            >
              <Package className="w-3.5 h-3.5" />
              <span>অর্ডার ট্র্যাক</span>
            </button>

            {/* Loyalty Points Button */}
            <button
              id="header-loyalty-club-btn"
              onClick={() => setIsLoyaltyOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
              title="অসাম ক্লাব রিওয়ার্ডস"
            >
              <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="hidden xs:inline">ক্লাব</span>
              <span className="font-bold text-neutral-900">{loyalty.points} পয়েন্ট</span>
            </button>

            {/* Admin / Inventory Management Button */}
            <button
              id="header-admin-portal-btn"
              onClick={() => setViewMode(viewMode === 'admin' ? 'store' : 'admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-full transition-colors relative ${
                viewMode === 'admin'
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              title="ইনভেন্টরি ও অর্ডার ব্যবস্থাপনা"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ইনভেন্টরি</span>
              {lowStockCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* Wishlist Indicator */}
            <button
              id="header-wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-neutral-700 hover:text-black rounded-full hover:bg-neutral-100 relative transition-colors"
              title="পছন্দের তালিকা"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 bg-neutral-950 text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors shadow-sm ml-1"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">ব্যাগ</span>
              <span className="inline-flex items-center justify-center bg-white text-neutral-950 rounded-full w-5 h-5 text-xs font-extrabold">
                {cartCount}
              </span>
              {cartSubtotal > 0 && (
                <span className="hidden md:inline font-semibold pl-1 border-l border-neutral-700">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ডেনিম, টি-শার্ট, শার্ট খুঁজুন..."
              className="w-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs rounded-full pl-9 pr-4 py-2 focus:bg-white focus:border-neutral-900 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400"
              >
                মুছুন
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-neutral-100 py-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategoryFilter === cat.id && viewMode === 'store';
              return (
                <button
                  key={cat.id}
                  id={`cat-nav-${cat.id}`}
                  onClick={() => handleCategorySelect(cat.id, cat.label)}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
            <button
              onClick={() => handleCategorySelect('polo', 'পোলো টি-শার্ট')}
              className="hover:text-black flex items-center gap-1 transition-colors"
            >
              <span>🔥 ভাইরাল পোলো</span>
            </button>
            <span className="text-neutral-300">•</span>
            <button
              onClick={() => handleCategorySelect('winter-wear', 'উইন্টার কালেকশন')}
              className="hover:text-black flex items-center gap-1 transition-colors"
            >
              <span>❄️ উইন্টার কালেকশন</span>
            </button>
            <span className="text-neutral-300">•</span>
            <button
              onClick={() => handleCategorySelect('t-shirts', 'বক্সি টি-শার্ট')}
              className="hover:text-black transition-colors"
            >
              <span>২৪০ জিএসএম টি</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu - Rendered via Portal into document.body to avoid stacking context & backdrop-filter issues */}
      {isMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start transition-opacity animate-in fade-in duration-200"
          >
            <div
              id="mobile-menu-drawer"
              onClick={(e) => e.stopPropagation()}
              className="w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-neutral-200"
            >
              {/* Drawer Top Header */}
              <div className="p-5">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white font-black text-xs">
                      <span className="text-amber-400 font-bold mr-0.5">A</span>P
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-neutral-900 tracking-tight leading-tight">
                        অসাম পয়েন্ট
                      </span>
                      <span className="text-[10px] text-neutral-500 font-semibold">
                        Awesome Point • Dhaka
                      </span>
                    </div>
                  </div>
                  <button
                    id="mobile-menu-close-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none"
                    aria-label="মেন্যু বন্ধ করুন"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Action Grid (Cart, Wishlist, Tracking, Club) */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  {/* Cart */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>ব্যাগ</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-white text-neutral-950 text-[10px] font-black flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 text-neutral-900 text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-neutral-700" />
                      <span>পছন্দ</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  {/* Order Tracking */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsTrackingOpen(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-900 hover:bg-neutral-200 transition-colors"
                  >
                    <Package className="w-4 h-4 text-neutral-700" />
                    <span>অর্ডার ট্র্যাক</span>
                  </button>

                  {/* Loyalty Club */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoyaltyOpen(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-xs font-semibold text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>{loyalty.points} ক্লাব পয়েন্ট</span>
                  </button>
                </div>

                {/* Categories Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                      পোশাকের কালেকশন
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      ৭টি ক্যাটাগরি
                    </span>
                  </div>

                  {/* Category Buttons */}
                  {categories.map((cat) => {
                    const isActive = activeCategoryFilter === cat.id && viewMode === 'store';
                    return (
                      <button
                        key={cat.id}
                        id={`mobile-drawer-cat-${cat.id}`}
                        onClick={() => handleCategorySelect(cat.id, cat.label)}
                        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-amber-400' : 'bg-neutral-300'
                            }`}
                          />
                          <span>{cat.label}</span>
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span>{cat.count}টি</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Extra Helpful Navigation Items */}
                <div className="mt-5 pt-4 border-t border-neutral-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1.5 px-1">
                    সেবা ও তথ্য
                  </span>

                  {/* Size Guide */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSizeGuideOpen(true);
                    }}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5 text-neutral-500" />
                      ইন্টারঅ্যাক্টিভ সাইজ চার্ট
                    </span>
                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                  </button>

                  {/* FAQ */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setViewMode('store');
                      setTimeout(() => {
                        document
                          .getElementById('faq-section')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      সচরাচর জিজ্ঞাসা (FAQ)
                    </span>
                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                  </button>

                  {/* Merchant Admin */}
                  <button
                    onClick={() => {
                      setViewMode('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
                      ইনভেন্টরি ও স্টক ম্যানেজার
                    </span>
                    {lowStockCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                        {lowStockCount}টি সীমিত
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Support Info */}
              <div className="p-5 border-t border-neutral-200 bg-neutral-50/70 text-xs text-neutral-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">কাস্টমার হেল্পলাইন</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    সকাল ১০টা - রাত ১০টা
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a
                    href="tel:01800080808"
                    className="font-bold text-neutral-900 hover:underline"
                  >
                    ০১৮০০-০৮০৮০৮ (হোয়াটসঅ্যাপ / কল)
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <a
                    href="https://www.facebook.com/awesomepoint420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline text-[11px]"
                  >
                    fb.com/awesomepoint420
                  </a>
                </div>
                <p className="text-[10px] text-neutral-400 pt-1">
                  ৬৪ জেলায় ক্যাশ অন ডেলিভারি ও দ্রুততম হোম ডেলিভারি
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

