import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Ruler,
  Truck,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Zap,
  Edit2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_REVIEWS } from '../data/mockData';
import { getImageUrl } from '../utils/imageUrl';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setEditingProduct,
    setViewMode,
    addToCart,
    setIsCartOpen,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setActiveSizeGuideId,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setQuantity(1);
      // Pick first in-stock variant
      const firstAvailable = selectedProduct.variants.find((v) => v.stockQuantity > 0);
      setSelectedSize(firstAvailable ? firstAvailable.size : selectedProduct.variants[0]?.size || '');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const currentVariant =
    selectedProduct.variants.find((v) => v.size === selectedSize) || selectedProduct.variants[0];
  const isVariantSoldOut = !currentVariant || currentVariant.stockQuantity <= 0;
  const isFavorited = isInWishlist(selectedProduct.id);

  const currentPrice = currentVariant?.salePrice ?? selectedProduct.salePrice ?? selectedProduct.price;
  const originalPrice = selectedProduct.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountAmount = originalPrice - currentPrice;

  // Filter reviews for this product
  const productReviews = INITIAL_REVIEWS.filter((r) => r.productId === selectedProduct.id);

  const handleAddToCart = () => {
    if (isVariantSoldOut || !currentVariant) return;
    addToCart(selectedProduct, currentVariant, quantity);
  };

  const handleBuyNow = () => {
    if (isVariantSoldOut || !currentVariant) return;
    const added = addToCart(selectedProduct, currentVariant, quantity);
    if (added) {
      setSelectedProduct(null);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-neutral-600 hover:text-black hover:bg-white shadow-md transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Product Images Gallery */}
            <div className="space-y-3">
              {/* Main Image View */}
              <div className="relative aspect-4/5 w-full bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src={getImageUrl(selectedProduct.images[activeImageIndex]?.url || selectedProduct.images[0]?.url)}
                  alt={selectedProduct.nameBn || selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {hasDiscount && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-black tracking-wider bg-neutral-950 text-white uppercase rounded-md shadow-xs">
                    ৳{discountAmount.toLocaleString()} ছাড়
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-neutral-950 ring-2 ring-neutral-950/20'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={getImageUrl(img.url)} alt={img.alt} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Value Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-600">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span>৬৪ জেলায় ক্যাশ অন ডেলিভারি</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span>ডোরস্টেপ সাইজ পরিবর্তন সুবিধা</span>
                </div>
              </div>
            </div>

            {/* Right: Product Options & Purchase Form */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                {/* Brand & Category */}
                <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold tracking-wider">
                  <span>{selectedProduct.brand} • {selectedProduct.categoryLabel}</span>
                  <div className="flex items-center gap-2">
                    <span>SKU: {currentVariant ? currentVariant.sku : selectedProduct.sku}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(selectedProduct);
                        setSelectedProduct(null);
                        setViewMode('admin');
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold tracking-normal transition-colors"
                      title="অ্যাডমিন প্যানেলে এডিট করুন"
                    >
                      <Edit2 className="w-2.5 h-2.5 text-amber-600" />
                      <span>এডিট</span>
                    </button>
                  </div>
                </div>

                {/* Bangla Title & English subtitle */}
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-1 leading-snug">
                  {selectedProduct.nameBn || selectedProduct.name}
                </h2>
                <p className="text-xs font-medium text-neutral-500 mt-0.5">
                  {selectedProduct.name}
                </p>

                {/* Rating & Wishlist Row */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'fill-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-neutral-800">
                      {selectedProduct.rating}
                    </span>
                    <span className="text-xs text-neutral-400">
                      ({selectedProduct.reviewCount} জন কাস্টমার রিভিউ)
                    </span>
                  </div>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-rose-600 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorited ? 'fill-rose-600 text-rose-600' : ''
                      }`}
                    />
                    <span>{isFavorited ? 'সংরক্ষিত' : 'পছন্দের তালিকায়'}</span>
                  </button>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm sm:text-base text-neutral-400 line-through">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% ছাড়
                      </span>
                    </>
                  )}
                </div>

                {/* Variant: Size Selector with Stock Status */}
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900 tracking-wider">
                      সাইজ নির্বাচন করুন: <span className="font-normal text-neutral-600">{selectedSize}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSizeGuideId(selectedProduct.sizeChartId);
                        setIsSizeGuideOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-neutral-600 underline"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>সাইজ গাইড →</span>
                    </button>
                  </div>

                  {/* Size buttons grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {selectedProduct.variants.map((variant) => {
                      const isSelected = selectedSize === variant.size;
                      const isSoldOut = variant.stockQuantity === 0;
                      const isLow = variant.stockQuantity > 0 && variant.stockQuantity <= 3;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            if (!isSoldOut) {
                              setSelectedSize(variant.size);
                              setQuantity(1);
                            }
                          }}
                          disabled={isSoldOut}
                          className={`relative py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-neutral-950/20'
                              : isSoldOut
                              ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                              : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-500'
                          }`}
                        >
                          <span className="text-sm">{variant.size}</span>
                          <span
                            className={`text-[9px] mt-0.5 ${
                              isSelected
                                ? 'text-neutral-300'
                                : isSoldOut
                                ? 'text-neutral-300'
                                : isLow
                                ? 'text-amber-600 font-bold'
                                : 'text-neutral-400'
                            }`}
                          >
                            {isSoldOut ? 'স্টক শেষ' : isLow ? `${variant.stockQuantity}টি বাকি` : 'মজুত আছে'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock notice alert */}
                  {currentVariant && currentVariant.stockQuantity > 0 && currentVariant.stockQuantity <= 3 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        দ্রুত অর্ডার করুন! {selectedSize} সাইজে আর মাত্র <strong>{currentVariant.stockQuantity}টি বাকি</strong> আছে।
                      </span>
                    </div>
                  )}

                  {isVariantSoldOut && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedSize} সাইজটি বর্তমানে স্টক শেষ। অন্য সাইজ বেছে নিন বা হটলাইনে যোগাযোগ করুন।</span>
                    </div>
                  )}
                </div>

                {/* Quantity & Action Buttons */}
                <div className="mt-5 pt-4 border-t border-neutral-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-neutral-800">পরিমাণ:</span>
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isVariantSoldOut}
                        className="px-3 py-1.5 text-sm font-bold text-neutral-700 hover:bg-neutral-200 rounded-l-lg disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-xs font-bold text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentVariant && quantity < currentVariant.stockQuantity) {
                            setQuantity(quantity + 1);
                          }
                        }}
                        disabled={
                          !currentVariant || quantity >= currentVariant.stockQuantity || isVariantSoldOut
                        }
                        className="px-3 py-1.5 text-sm font-bold text-neutral-700 hover:bg-neutral-200 rounded-r-lg disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs text-neutral-500">
                      মোট মূল্য: <strong>৳{(currentPrice * quantity).toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      id="modal-add-to-cart-btn"
                      onClick={handleAddToCart}
                      disabled={isVariantSoldOut}
                      className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 border-2 transition-all ${
                        isVariantSoldOut
                          ? 'bg-neutral-200 text-neutral-400 border-neutral-200 cursor-not-allowed'
                          : 'bg-white text-neutral-950 border-neutral-950 hover:bg-neutral-100 active:scale-95'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isVariantSoldOut ? 'স্টক শেষ' : 'ব্যাগে যোগ করুন'}</span>
                    </button>

                    <button
                      id="modal-buy-now-btn"
                      onClick={handleBuyNow}
                      disabled={isVariantSoldOut}
                      className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isVariantSoldOut
                          ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                          : 'bg-neutral-950 text-white hover:bg-neutral-800 active:scale-95'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>সরাসরি কিনুন (ক্যাশ অন ডেলিভারি)</span>
                    </button>
                  </div>
                </div>

                {/* Loyalty points note */}
                <div className="mt-3 text-center text-[11px] text-neutral-500">
                  এই অর্ডারে আপনি পাচ্ছেন <strong>+{Math.floor((currentPrice * quantity) / 10)} অসাম ক্লাব পয়েন্ট</strong>।
                </div>
              </div>

              {/* Tabs: Details vs Reviews */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="flex border-b border-neutral-200 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 px-3 border-b-2 transition-colors ${
                      activeTab === 'details'
                        ? 'border-neutral-950 text-neutral-950'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    ফ্যাব্রিক ও বিস্তারিত
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'reviews'
                        ? 'border-neutral-950 text-neutral-950'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <span>কাস্টমার রিভিউ</span>
                    <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-800 text-[10px] rounded-full">
                      {productReviews.length || selectedProduct.reviewCount}
                    </span>
                  </button>
                </div>

                {/* Details Tab Content */}
                {activeTab === 'details' ? (
                  <div className="pt-3 space-y-3 text-xs text-neutral-700">
                    <p className="leading-relaxed">{selectedProduct.descriptionBn || selectedProduct.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-neutral-800 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block">ফ্যাব্রিক উপাদান</span>
                        <span className="font-semibold">{selectedProduct.fabric}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block">ফিটিং প্যাটার্ন</span>
                        <span className="font-semibold">{selectedProduct.fit}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">যত্ন ও ধোয়ার নির্দেশিকা</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-neutral-600">
                        {(selectedProduct.careInstructionsBn || selectedProduct.careInstructions).map((ci, i) => (
                          <li key={i}>{ci}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  /* Reviews Tab Content */
                  <div className="pt-3 space-y-3 max-h-48 overflow-y-auto">
                    {productReviews.length > 0 ? (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-neutral-900">{rev.author}</span>
                              {rev.isVerified && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  যাচাইকৃত ক্রেতা
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-400">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 text-xs">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            {rev.sizePurchased && (
                              <span className="text-[10px] text-neutral-500 ml-1">
                                সাইজ: <strong>{rev.sizePurchased}</strong> ({rev.fitFeedback})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-700">{rev.comment}</p>
                          {rev.customerPhoto && (
                            <div className="mt-2 pt-1 flex items-center gap-2">
                              <img
                                src={getImageUrl(rev.customerPhoto)}
                                alt="কাস্টমার ফটো রিভিউ"
                                referrerPolicy="no-referrer"
                                className="w-14 h-16 rounded-md object-cover border border-neutral-200 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                              />
                              <span className="text-[10px] text-neutral-500 font-medium">কাস্টমার প্রদত্ত ছবি</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-neutral-500">
                        এই SKU-এর জন্য এখনো কোনো সরাসরি রিভিউ জমা পড়েনি। ফেসবুক ভেরিফাইড ফিডব্যাকের ভিত্তিতে সার্বিক রেটিং {selectedProduct.rating} / ৫।
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
