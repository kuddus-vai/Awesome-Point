import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Plus,
  Minus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  // Free shipping threshold ৳1,500
  const freeShippingThreshold = 1500;
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-[11px] font-black">
                <span className="text-amber-400 mr-0.5">অ</span>প
              </div>
              <h2 className="text-base font-extrabold text-neutral-950 tracking-tight">
                শপিং ব্যাগ ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="ব্যাগ বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-neutral-900 text-neutral-200 px-4 py-2.5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 font-semibold text-[11px]">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {amountNeeded === 0 ? (
                  <span className="text-amber-300 font-bold">অভিনন্দন! ঢাকায় ফ্রি ডেলিভারি আনলক হয়েছে!</span>
                ) : (
                  <span>
                    আর মাত্র <strong className="text-white">৳{amountNeeded.toLocaleString()}</strong> টাকার পণ্য কিনলে ফ্রি ডেলিভারি!
                  </span>
                )}
              </span>
              <span className="text-[10px] text-neutral-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => {
                const unitPrice = item.variant.salePrice ?? item.product.salePrice ?? item.product.price;
                const itemTotal = unitPrice * item.quantity;
                const maxStock = item.variant.stockQuantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 relative group"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.nameBn || item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-22 object-cover object-center rounded-lg bg-neutral-200 border border-neutral-200 shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1 leading-snug">
                            {item.product.nameBn || item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                          <span className="font-semibold text-neutral-800 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                            সাইজ: {item.variant.size}
                          </span>
                          <span>•</span>
                          <span>{item.variant.color}</span>
                        </div>
                      </div>

                      {/* Quantity Adjuster & Line Total */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-200/60">
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 rounded-l-lg text-neutral-700"
                            aria-label="কমান"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className="p-1 hover:bg-neutral-100 rounded-r-lg text-neutral-700 disabled:opacity-30"
                            aria-label="বাড়ান"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-neutral-950">
                            ৳{itemTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-neutral-400 block">
                            (৳{unitPrice} প্রতি পিস)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 px-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">আপনার শপিং ব্যাগ খালি</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  আমাদের প্রিমিয়াম ডেনিম কালেকশন, ড্রপ শোল্ডার টি-শার্ট ও শর্টস ঘুরে দেখুন।
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer with Subtotal and Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>মোট সাবটোটাল</span>
                  <span className="font-bold text-neutral-950 text-sm">
                    ৳{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                  <span>ডেলিভারি চার্জ</span>
                  <span>চেকআউটে নির্ধারিত হবে (৳৮০ থেকে শুরু)</span>
                </div>
                <div className="flex items-center justify-between text-amber-600 text-[11px] font-semibold pt-1">
                  <span>অসাম ক্লাব পয়েন্ট</span>
                  <span>+{Math.floor(cartSubtotal / 10)} পয়েন্ট অর্জিত হবে</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="drawer-proceed-checkout-btn"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 px-4 bg-neutral-950 text-white font-bold text-xs sm:text-sm tracking-wider rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
              >
                <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-neutral-700" />
                  ক্যাশ অন ডেলিভারি প্রযোজ্য
                </span>
                <span>•</span>
                <span>ঘরে বসেই সাইজ বদলের সুবিধা</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </>
  );
};
