import React from 'react';
import { ArrowRight, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';

export const PremiumPicksSection: React.FC = () => {
  const { setSelectedProduct, addToCart, products } = useStore();

  // Featured main product
  const mainProduct = products.find((p) => p.sku === 'AP-UP-11') || products[0];

  // Secondary side products
  const sideProducts = [
    products.find((p) => p.sku === 'AP-UP-04') || products[1],
    products.find((p) => p.sku === 'AP-UP-01') || products[2],
    products.find((p) => p.sku === 'AP-UP-17') || products[3],
  ].filter(Boolean);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-red-600">
              FEATURED SHOWCASE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 mt-1">
            PREMIUM PICKS
          </h2>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large Featured Tile (Left) */}
        <div
          onClick={() => setSelectedProduct(mainProduct)}
          className="lg:col-span-7 group relative rounded-2xl overflow-hidden bg-neutral-900 text-white min-h-[420px] p-6 sm:p-8 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-xl transition-all"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(mainProduct.images[0]?.url)}
              alt={mainProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
              SPOTLIGHT OF THE WEEK
            </span>
            <div className="flex items-center gap-1 text-amber-400 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{mainProduct.rating}</span>
            </div>
          </div>

          {/* Bottom Info & CTA */}
          <div className="relative z-10 space-y-3 max-w-md">
            <div>
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider">
                {mainProduct.sku} • {mainProduct.fit}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5">
                {mainProduct.nameBn || mainProduct.name}
              </h3>
            </div>
            <p className="text-xs text-neutral-300 line-clamp-2">
              {mainProduct.description}
            </p>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white">
                  {(mainProduct.salePrice || mainProduct.price).toLocaleString()} BDT
                </span>
                {mainProduct.salePrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    {mainProduct.price.toLocaleString()} BDT
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(mainProduct);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md group-hover:translate-x-1"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-tile Stack (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {sideProducts.map((p) => {
            const currentPrice = p.salePrice || p.price;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group flex items-center gap-4 bg-white p-3.5 rounded-xl border border-neutral-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img
                    src={getImageUrl(p.images[0]?.url)}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                      {p.sku}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 leading-snug group-hover:text-red-600 transition-colors">
                      {p.nameBn || p.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                      {p.fabric}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                    <span className="text-xs sm:text-sm font-black text-neutral-950">
                      {currentPrice.toLocaleString()} BDT
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p, p.variants[0], 1);
                      }}
                      className="p-1.5 rounded-md bg-neutral-100 group-hover:bg-red-600 group-hover:text-white text-neutral-700 transition-colors"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
