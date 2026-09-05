import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    setSelectedProduct,
    setIsCartOpen,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-neutral-950 text-neutral-950" />
            <h2 className="text-base font-extrabold text-neutral-950 tracking-tight">
              পছন্দের তালিকা ({wishlistedProducts.length})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistedProducts.length > 0 ? (
            wishlistedProducts.map((prod) => {
              const hasStock = prod.variants.some((v) => v.stockQuantity > 0);
              return (
                <div
                  key={prod.id}
                  className="flex gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 relative group"
                >
                  <img
                    src={getImageUrl(prod.images[0]?.url)}
                    alt={prod.nameBn || prod.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-22 object-cover rounded-lg bg-neutral-200 border border-neutral-200 shrink-0 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setIsWishlistOpen(false);
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsWishlistOpen(false);
                          }}
                          className="text-xs font-bold text-neutral-900 line-clamp-1 cursor-pointer hover:underline"
                        >
                          {prod.nameBn || prod.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-black text-neutral-950 mt-1">
                        <span>৳{(prod.salePrice ?? prod.price).toLocaleString()}</span>
                        {prod.salePrice && (
                          <span className="text-[10px] text-neutral-400 line-through font-normal">
                            ৳{prod.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-semibold mt-1 inline-block ${
                          hasStock ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {hasStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setIsWishlistOpen(false);
                      }}
                      className="mt-2 w-full py-1.5 px-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>সাইজ বেছে নিয়ে যোগ করুন</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">আপনার পছন্দের তালিকা খালি</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                পণ্য কার্ডের হার্ট আইকনে ক্লিক করে আপনার পছন্দের পোশাকগুলো সংরক্ষণ করুন।
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
          >
            কালেকশন ঘুরে দেখুন
          </button>
        </div>
      </div>
    </div>
  );
};
