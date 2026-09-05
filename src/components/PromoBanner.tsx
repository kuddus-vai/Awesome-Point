import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Sparkles, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromoBanner: React.FC = () => {
  const { setSelectedProduct, products } = useStore();

  // Fake ticking countdown for urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = () => {
    const featuredShirt = products.find((p) => p.category === 'shirts') || products[0];
    if (featuredShirt) {
      setSelectedProduct(featuredShirt);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-800 via-red-700 to-neutral-900 text-white shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full bg-black/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Content */}
          <div className="md:col-span-7 space-y-4">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-xs border border-white/20">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Limited Time Deal!</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
              Step into confidence with our Formal Stitch Cotton Shirt
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-red-100 font-semibold">
              Buy Now Discount is Running — <span className="text-amber-300 font-extrabold">Flat 40% Off</span> on Selected Cotton Weaves!
            </p>

            {/* Deal Countdown Boxes */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1 text-xs text-red-200 font-bold mr-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>অফার শেষ হতে বাকি:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-black/40 backdrop-blur-xs border border-white/10 px-2.5 py-1.5 rounded-lg text-center min-w-10">
                  <span className="block text-sm sm:text-base font-black text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-red-200 uppercase font-bold">ঘণ্টা</span>
                </div>
                <span className="font-bold text-white">:</span>
                <div className="bg-black/40 backdrop-blur-xs border border-white/10 px-2.5 py-1.5 rounded-lg text-center min-w-10">
                  <span className="block text-sm sm:text-base font-black text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-red-200 uppercase font-bold">মিনিট</span>
                </div>
                <span className="font-bold text-white">:</span>
                <div className="bg-black/40 backdrop-blur-xs border border-white/10 px-2.5 py-1.5 rounded-lg text-center min-w-10">
                  <span className="block text-sm sm:text-base font-black text-amber-300">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-red-200 uppercase font-bold">সেকেন্ড</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <button
                onClick={handleBuyNow}
                className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-red-700 font-black text-xs sm:text-sm rounded-xl shadow-lg inline-flex items-center gap-2 transition-all transform active:scale-95 group"
              >
                <span>Buy Now!</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Product Spotlight Image */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src="/products/471497826_580214131395965_5662951532402043813_n.jpg"
                alt="অক্সফোর্ড কটন শার্ট স্পেশাল ডিল"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-red-600/90 backdrop-blur-xs text-white text-[11px] font-black px-3 py-1 rounded-md shadow-xs">
                ৳৭৯০ BDT (ছিল ৳১,১০০)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
