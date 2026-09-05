import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategoryCardItem {
  id: string;
  name: string;
  nameBn: string;
  itemCount: string;
  image: string;
  filterCategory: string;
}

export const CategoryNav: React.FC = () => {
  const { setActiveCategoryFilter, setViewMode } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: CategoryCardItem[] = [
    {
      id: 'formal-shirt',
      name: 'Formal Shirt',
      nameBn: 'ফরমাল শার্ট',
      itemCount: '১২+ আইটেম',
      image: '/products/471497826_580214131395965_5662951532402043813_n.jpg',
      filterCategory: 'shirts',
    },
    {
      id: 'denim-pant',
      name: 'Denim Pant',
      nameBn: 'ডেনিম প্যান্ট',
      itemCount: '৮+ আইটেম',
      image: '/products/468808507_556709790402103_4633757504765611556_n.jpg',
      filterCategory: 'jeans',
    },
    {
      id: 'twill-pant',
      name: 'Twill Pant',
      nameBn: 'টুইল প্যান্ট',
      itemCount: '৬+ আইটেম',
      image: '/products/469070720_556709460402136_1283958730198251466_n.jpg',
      filterCategory: 'jeans',
    },
    {
      id: 'cargo-pant',
      name: 'Cargo Pant',
      nameBn: 'কার্গো প্যান্ট',
      itemCount: '৫+ আইটেম',
      image: '/products/469006329_556709767068772_7033291454476438040_n.jpg',
      filterCategory: 'jeans',
    },
    {
      id: 'casual-shirt',
      name: 'Casual Shirt',
      nameBn: 'ক্যাজুয়াল শার্ট',
      itemCount: '১০+ আইটেম',
      image: '/products/471795794_580214194729292_6551865620923564370_n.jpg',
      filterCategory: 'shirts',
    },
    {
      id: 'winter-collection',
      name: 'Winter Collection',
      nameBn: 'উইন্টার জ্যাকেট ও হুডি',
      itemCount: '৭+ আইটেম',
      image: '/products/466966518_544520338287715_1158647771518592632_n.jpg',
      filterCategory: 'winter-wear',
    },
    {
      id: 'polo-collection',
      name: 'Pique Polo',
      nameBn: 'পিকে পোলো টি-শার্ট',
      itemCount: '৯+ আইটেম',
      image: '/products/466100733_544519244954491_3233810994814867581_n.jpg',
      filterCategory: 'polo',
    },
  ];

  const handleSelect = (filterCategory: string) => {
    setViewMode('store');
    setActiveCategoryFilter(filterCategory);
    const target = document.getElementById('shop-catalog') || document.getElementById('shop-catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-red-600">
              Categories
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 mt-1">
            Browse By Category
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-red-600 hover:bg-red-600 hover:text-white text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-red-600 hover:bg-red-600 hover:text-white text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
            aria-label="Next Category"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Cards */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto pb-3 scrollbar-none scroll-smooth"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.filterCategory)}
            className="group flex-shrink-0 w-36 sm:w-44 bg-white p-3 rounded-xl border border-neutral-200 hover:border-red-500 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
          >
            {/* Circular Thumbnail Box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-neutral-100 p-1 mb-3 border-2 border-neutral-100 group-hover:border-red-500 transition-colors shadow-xs">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Category Name & Count */}
            <span className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1">
              {cat.name}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
              {cat.itemCount}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
