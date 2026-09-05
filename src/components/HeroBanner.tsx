import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Sparkles, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';

export const HeroBanner: React.FC = () => {
  const { setActiveCategoryFilter, setViewMode } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroCategories = [
    { id: 'shirts', name: 'Formal Shirt', nameBn: 'ফরমাল শার্ট', icon: '👔' },
    { id: 'jeans', name: 'Denim Pant', nameBn: 'ডেনিম প্যান্ট', icon: '👖' },
    { id: 'casual-wear', name: 'Twill Pant', nameBn: 'টুইল প্যান্ট', icon: '🩳' },
    { id: 'casual-wear', name: 'Cargo Pant', nameBn: 'কার্গো প্যান্ট', icon: '🪖' },
    { id: 'shirts', name: 'Casual Shirt', nameBn: 'ক্যাজুয়াল শার্ট', icon: '👕' },
    { id: 'jeans', name: 'Formal Pants', nameBn: 'ফরমাল প্যান্টস', icon: '👞' },
  ];

  const slides = [
    {
      title: 'Step into Confidence',
      subtitle: 'Premium Menswear Collection',
      description: 'Exclusive 2026 Formal Shirts, Rigid Denim & Streetwear Crafted with Superior Comfort.',
      tag: 'NEW ARRIVALS • 40% OFF',
      image: '/Banner.jpg',
      ctaText: 'Shop Now',
      priceText: 'Starting From 750 BDT',
      categoryId: 'shirts',
    },
    {
      title: 'Heavy Rigid Denim & Cargo',
      subtitle: 'Semi-Baggy & Relaxed Cuts',
      description: '13.5 oz heavy ring-spun denim and tactical cargos engineered for all-day streetwear versatility.',
      tag: 'BESTSELLER • LIMITED STOCK',
      image: '/products/468808507_556709790402103_4633757504765611556_n.jpg',
      ctaText: 'Explore Denim',
      priceText: 'Starting From 850 BDT',
      categoryId: 'jeans',
    },
    {
      title: 'Tactical Bomber & Winter Drop',
      subtitle: 'Diamond Quilted Thermal Lining',
      description: 'Windproof micro-poly shell crafted for modern urban life with sleek matte finish.',
      tag: 'WINTER SPECIAL 2026',
      image: '/products/466966518_544520338287715_1158647771518592632_n.jpg',
      ctaText: 'View Jackets',
      priceText: 'Starting From 1150 BDT',
      categoryId: 'winter-wear',
    },
  ];

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCategorySelect = (categoryId: string) => {
    setViewMode('store');
    setActiveCategoryFilter(categoryId);
    const target = document.getElementById('shop-catalog') || document.getElementById('shop-catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlide = slides[activeSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Categories Sidebar */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          {/* Header Bar */}
          <div className="bg-red-600 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="font-black text-xs tracking-wider uppercase">
                Categories
              </span>
            </div>
            <span className="text-[10px] bg-red-700 font-bold px-2 py-0.5 rounded text-white/90">
              EXPLORE
            </span>
          </div>

          {/* Category List */}
          <div className="divide-y divide-neutral-100 flex-1 flex flex-col justify-between py-1">
            {heroCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategorySelect(cat.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-neutral-700 hover:bg-neutral-50 hover:text-red-600 font-bold text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{cat.icon}</span>
                  <div className="flex flex-col">
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-neutral-400 font-normal">{cat.nameBn}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {/* Promo Callout in Category Sidebar */}
          <div className="p-3 bg-neutral-900 text-white text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">সারা দেশে ক্যাশ অন ডেলিভারি</span>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold">AP</span>
          </div>
        </div>

        {/* Right Slider Banner */}
        <div className="lg:col-span-9 relative rounded-xl overflow-hidden min-h-[360px] sm:min-h-[440px] flex items-center bg-neutral-950 text-white shadow-md">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(currentSlide.image)}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 scale-100"
            />
            {/* Dark overlay gradients for crisp text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/75 to-neutral-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
          </div>

          {/* Slide Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-xl space-y-4">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{currentSlide.tag}</span>
            </div>

            {/* Titles */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
                {currentSlide.title}
              </h1>
              <p className="text-sm sm:text-base font-bold text-amber-400">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-md">
              {currentSlide.description}
            </p>

            {/* Price tag & CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleCategorySelect(currentSlide.categoryId)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-lg shadow-lg flex items-center gap-2 transition-all transform active:scale-95 group"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                  Special Offer
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {currentSlide.priceText}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Arrows */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2">
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors backdrop-blur-xs border border-white/10"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors backdrop-blur-xs border border-white/10"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-10 z-20 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeSlide ? 'w-6 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
