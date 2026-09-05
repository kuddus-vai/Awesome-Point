import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  badgeText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badgeText }) => {
  const { setSelectedProduct, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const firstInStock = product.variants.find((v) => v.stockQuantity > 0);
    return firstInStock ? firstInStock.size : product.variants[0]?.size || '';
  });
  const [isHovered, setIsHovered] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentVariant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const isOutOfStock = product.variants.every((v) => v.stockQuantity === 0);
  const selectedVariantOutOfStock = currentVariant?.stockQuantity === 0;

  const currentPrice = currentVariant?.salePrice ?? product.salePrice ?? product.price;
  const originalPrice = product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVariant || currentVariant.stockQuantity <= 0) return;
    addToCart(product, currentVariant, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-red-300"
    >
      {/* Product Image Box */}
      <div className="relative aspect-3/4 w-full bg-neutral-100 overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge on top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {badgeText ? (
            <span className="px-2 py-0.5 text-[10px] font-black tracking-wide bg-red-600 text-white uppercase rounded-md shadow-xs">
              {badgeText}
            </span>
          ) : discountPercent ? (
            <span className="px-2 py-0.5 text-[10px] font-black tracking-wide bg-red-600 text-white uppercase rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : product.isNew ? (
            <span className="px-2 py-0.5 text-[10px] font-black tracking-wide bg-neutral-900 text-white uppercase rounded-md shadow-xs">
              NEW
            </span>
          ) : null}

          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-700 text-white uppercase rounded-md shadow-xs">
              স্টক শেষ
            </span>
          )}
        </div>

        {/* Wishlist Heart on top right */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-neutral-600 hover:text-red-600 hover:bg-white shadow-xs transition-colors z-10"
          aria-label="পছন্দের তালিকায় রাখুন"
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-red-600 text-red-600' : ''}`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="hidden sm:flex absolute bottom-2.5 right-2.5 p-2 bg-white/90 text-neutral-800 rounded-lg hover:bg-neutral-900 hover:text-white shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
          title="বিস্তারিত দেখুন"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* SKU / Code & Category */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold tracking-wider uppercase mb-0.5">
            <span className="text-red-600 font-bold">{product.sku}</span>
            <span className="truncate max-w-[100px]">{product.categoryLabel}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 leading-snug group-hover:text-red-600 transition-colors">
            {product.nameBn || product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] font-bold text-neutral-500">
              ({product.reviewCount || 35})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-sm sm:text-base font-black text-neutral-950">
              {currentPrice.toLocaleString()} BDT
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {originalPrice.toLocaleString()} BDT
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Drawer / Row if hovered or expanded */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1 pt-1 border-t border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-medium mr-0.5">সাইজ:</span>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 4).map((v) => {
                const isSelected = selectedSize === v.size;
                const isVariantSoldOut = v.stockQuantity === 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(v.size);
                    }}
                    disabled={isVariantSoldOut}
                    className={`min-w-6 h-5 px-1 text-[10px] font-bold rounded border transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : isVariantSoldOut
                        ? 'bg-neutral-100 text-neutral-300 border-neutral-200 line-through cursor-not-allowed'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-500'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add To Cart Full-Width Button */}
        <button
          onClick={handleQuickAdd}
          disabled={selectedVariantOutOfStock}
          className={`w-full py-2 px-3 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 ${
            selectedVariantOutOfStock
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-950 text-white hover:bg-red-600 active:scale-98'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{selectedVariantOutOfStock ? 'স্টক শেষ' : 'Add To Cart'}</span>
        </button>
      </div>
    </div>
  );
};
