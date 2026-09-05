import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const BestSellingSection: React.FC = () => {
  const { products, setActiveCategoryFilter } = useStore();

  // Pick top 5 best selling items from real uploaded products
  const bestSellers = products
    .filter((p) => p.isFeatured || p.rating >= 4.8)
    .slice(0, 5);

  const handleViewAll = () => {
    setActiveCategoryFilter('all');
    const target = document.getElementById('shop-catalog') || document.getElementById('shop-catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-neutral-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-red-600 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              TOP TRENDING
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 mt-1">
            BEST SELLING PRODUCTS
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            গ্রাহকদের সবচেয়ে পছন্দের এবং সর্বাধিক বিক্রিত প্রিমিয়াম কালেকশন
          </p>
        </div>

        <button
          onClick={handleViewAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-Column Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
