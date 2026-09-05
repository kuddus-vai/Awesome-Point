import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export const ExploreProductsSection: React.FC = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'formal-shirt', label: 'Formal Shirt' },
    { id: 'denim-pant', label: 'Denim Pant' },
    { id: 'twill-pant', label: 'Twill Pant' },
    { id: 'cargo-pant', label: 'Cargo Pant' },
    { id: 'casual-shirt', label: 'Casual Shirt' },
    { id: 'formal-pants', label: 'Formal Pants' },
  ];

  // Map products to categories
  const formalShirts = products.filter((p) => p.category === 'shirts').slice(0, 5);
  const denimPants = products.filter((p) => p.category === 'jeans').slice(0, 5);
  const casualShirts = products.filter((p) => p.category === 'shirts' || p.category === 'polo').slice(0, 5);
  const winterCollection = products.filter((p) => p.category === 'winter-wear').slice(0, 5);

  // Filter if specific tab is selected
  const getFilteredList = (tab: string): Product[] => {
    switch (tab) {
      case 'formal-shirt':
        return products.filter((p) => p.category === 'shirts');
      case 'denim-pant':
      case 'twill-pant':
      case 'cargo-pant':
      case 'formal-pants':
        return products.filter((p) => p.category === 'jeans');
      case 'casual-shirt':
        return products.filter((p) => p.category === 'shirts' || p.category === 'polo');
      default:
        return products;
    }
  };

  const filteredTabProducts = getFilteredList(activeTab);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-black tracking-widest uppercase">
          • OUR CATALOG •
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
          EXPLORE OUR PRODUCTS
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500">
          অফিসিয়াল কালেকশন থেকে আপনার পছন্দের আধুনিক স্টাইল নির্বাচন করুন
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* If specific tab selected, show filtered grid */}
      {activeTab !== 'all' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredTabProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        /* If 'all' selected, show the grouped sections with dot accents */
        <div className="space-y-12">
          {/* 1. Formal Shirt Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-red-600 font-black text-xs sm:text-sm tracking-widest uppercase py-2 border-y border-neutral-100 bg-neutral-50/50 rounded-lg">
              <span className="text-red-500">• •</span>
              <span>FORMAL SHIRT</span>
              <span className="text-red-500">• •</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {formalShirts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* 2. Denim Pant Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-red-600 font-black text-xs sm:text-sm tracking-widest uppercase py-2 border-y border-neutral-100 bg-neutral-50/50 rounded-lg">
              <span className="text-red-500">• •</span>
              <span>DENIM PANT</span>
              <span className="text-red-500">• •</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {denimPants.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* 3. Casual Shirt Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-red-600 font-black text-xs sm:text-sm tracking-widest uppercase py-2 border-y border-neutral-100 bg-neutral-50/50 rounded-lg">
              <span className="text-red-500">• •</span>
              <span>CASUAL SHIRT & POLO</span>
              <span className="text-red-500">• •</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {casualShirts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* 4. Winter Collection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-red-600 font-black text-xs sm:text-sm tracking-widest uppercase py-2 border-y border-neutral-100 bg-neutral-50/50 rounded-lg">
              <span className="text-red-500">• •</span>
              <span>WINTER COLLECTION</span>
              <span className="text-red-500">• •</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {winterCollection.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
