import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { BestSellingSection } from './components/BestSellingSection';
import { PromoBanner } from './components/PromoBanner';
import { ExploreProductsSection } from './components/ExploreProductsSection';
import { PremiumPicksSection } from './components/PremiumPicksSection';
import { PremiumServicesSection } from './components/PremiumServicesSection';
import { OurStorySection } from './components/OurStorySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrderTrackingView } from './components/OrderTrackingView';
import { LoyaltyModal } from './components/LoyaltyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { EditProductModal } from './components/EditProductModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Search,
  Package,
  Award,
  Sparkles,
  Facebook,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Menu,
} from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    viewMode,
    toasts,
    isTrackingOpen,
    isLoyaltyOpen,
    isCartOpen,
    isWishlistOpen,
    setIsMobileMenuOpen,
    selectedProduct,
    isSizeGuideOpen,
    cartCount,
    wishlist,
    editingProduct,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsTrackingOpen,
    setIsLoyaltyOpen,
    activeCategoryFilter,
    searchQuery,
  } = useStore();

  // If in Admin Dashboard view
  if (viewMode === 'admin') {
    return (
      <>
        <AdminDashboard />
        {/* Global Toast */}
        {toasts && toasts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-70 flex flex-col gap-2 max-w-xs pointer-events-none">
            {toasts.map((t) => (
              <div
                key={t.id}
                className="bg-neutral-950 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-neutral-800 animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
              >
                {t.message}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  const isBrowsingSpecific = Boolean((activeCategoryFilter && activeCategoryFilter !== 'all') || searchQuery.trim());

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col selection:bg-red-600 selection:text-white">
      {/* Announcement Top Banner */}
      <AnnouncementBar />

      {/* Main Sticky Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1">
        {/* If user is not searching or filtering, show complete full layout matching the reference UI */}
        {!isBrowsingSpecific ? (
          <>
            {/* 1. Hero Section: Left Categories Sidebar + Right Wide Slider */}
            <HeroBanner />

            {/* 2. Browse by Category Carousel */}
            <CategoryNav />

            {/* 3. Best Selling Products (5-Column Grid with View All CTA) */}
            <BestSellingSection />

            {/* 4. High-Impact Red Promotional Mid-Banner with Countdown */}
            <PromoBanner />

            {/* 5. Explore Our Products with Tabs and Grouped Red Header Dot Accents */}
            <ExploreProductsSection />

            {/* 6. Premium Picks Bento Grid Showcase */}
            <PremiumPicksSection />

            {/* 7. Full Filterable Catalog & Search */}
            <div id="shop-catalog">
              <ProductGrid />
            </div>

            {/* 8. Our Premium Services (Why Choose Us - 3 Cards) */}
            <PremiumServicesSection />

            {/* 9. Our Story & Authenticity Section */}
            <OurStorySection />

            {/* 10. Customer Testimonials & Verified Reviews */}
            <TestimonialsSection />

            {/* 11. Frequently Asked Questions */}
            <FAQSection />

            {/* 12. Community Street Style Lookbook */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
                    #AwesomePoint420
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight mt-1">
                    কমিউনিটি লুকবুক
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    ঢাকা, চট্টগ্রাম ও সিলেটের স্টাইলিশ তরুণদের পরা অসাম পয়েন্টের আসল স্ট্রিট ফ্যাশন।
                  </p>
                </div>
                <a
                  href="https://www.facebook.com/awesomepoint420"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors w-fit"
                >
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>আমাদের ফেসবুক কমিউনিটিতে যুক্ত হোন</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                  {
                    image: '/products/466100733_544519244954491_3233810994814867581_n.jpg',
                    tag: 'সিগনেচার পিক পোলো',
                    handle: '@tanvir.fit',
                    sku: 'AP-UP-01',
                  },
                  {
                    image: '/products/466966518_544520338287715_1158647771518592632_n.jpg',
                    tag: 'ট্যাকটিক্যাল বম্বার',
                    handle: '@sakib_street',
                    sku: 'AP-UP-04',
                  },
                  {
                    image: '/products/468808507_556709790402103_4633757504765611556_n.jpg',
                    tag: 'সেমি ব্যাগি ডেনিম',
                    handle: '@mahmud_kicks',
                    sku: 'AP-UP-11',
                  },
                  {
                    image: '/products/469006329_556709767068772_7033291454476438040_n.jpg',
                    tag: 'ট্যাকটিক্যাল কার্গো',
                    handle: '@rayhan.dhaka',
                    sku: 'AP-UP-13',
                  },
                  {
                    image: '/products/471497826_580214131395965_5662951532402043813_n.jpg',
                    tag: 'অক্সফোর্ড কটন শার্ট',
                    handle: '@fahim.core',
                    sku: 'AP-UP-17',
                  },
                  {
                    image: '/products/471795794_580214194729292_6551865620923564370_n.jpg',
                    tag: 'ক্যাজুয়াল স্ট্রাইপ শার্ট',
                    handle: '@asif_denim',
                    sku: 'AP-UP-18',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden aspect-3/4 bg-neutral-900 cursor-pointer shadow-xs"
                    onClick={() => {
                      const prod = products.find((p) => p.sku === item.sku) || products[0];
                      if (prod) setSelectedProduct(prod);
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.tag}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <span className="text-[10px] font-bold text-amber-400 block tracking-wider uppercase">
                        {item.tag}
                      </span>
                      <span className="text-xs font-semibold text-neutral-200 block truncate">
                        {item.handle}
                      </span>
                      <span className="text-[9px] text-neutral-400 flex items-center gap-1 mt-1 group-hover:text-white transition-colors">
                        <span>পণ্যটি দেখুন</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* If actively searching or filtered to specific category */
          <div id="shop-catalog" className="pt-4">
            <ProductGrid />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-3 py-2 flex items-center justify-between shadow-lg">
        <button
          id="mobile-bottom-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-neutral-700 hover:text-red-600 p-1"
          aria-label="ক্যাটাগরি ও মেন্যু খুলুন"
        >
          <Menu className="w-5 h-5 text-neutral-800" />
          <span className="text-[10px] font-bold">মেন্যু</span>
        </button>

        <button
          id="mobile-bottom-wishlist-btn"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-neutral-600 hover:text-red-600 p-1"
          aria-label="পছন্দের তালিকা দেখুন"
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute 0 right-1 w-3.5 h-3.5 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-semibold">পছন্দ</span>
        </button>

        <button
          id="mobile-bottom-tracking-btn"
          onClick={() => setIsTrackingOpen(true)}
          className="flex flex-col items-center gap-0.5 text-neutral-600 hover:text-red-600 p-1"
          aria-label="অর্ডার ট্র্যাক করুন"
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold">ট্র্যাকিং</span>
        </button>

        <button
          id="mobile-bottom-loyalty-btn"
          onClick={() => setIsLoyaltyOpen(true)}
          className="flex flex-col items-center gap-0.5 text-amber-600 hover:text-amber-700 p-1"
          aria-label="ক্লাব রিওয়ার্ড পয়েন্ট"
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-bold">ক্লাব</span>
        </button>

        <button
          id="mobile-bottom-cart-btn"
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-red-600 text-white rounded-full text-xs font-bold transition-colors"
          aria-label="শপিং ব্যাগ দেখুন"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ব্যাগ</span>
          {cartCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Saved Wishlist Drawer */}
      <WishlistDrawer />

      {/* Product Detail Modal */}
      {selectedProduct && <ProductDetailModal />}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && <SizeGuideModal />}

      {/* Order Tracking View Modal */}
      {isTrackingOpen && <OrderTrackingView />}

      {/* Loyalty Club Modal */}
      {isLoyaltyOpen && <LoyaltyModal />}

      {/* Edit Product Modal */}
      {editingProduct && <EditProductModal />}

      {/* Global Toast Alerts */}
      {toasts && toasts.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-70 flex flex-col gap-2 max-w-xs pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto ${
                t.type === 'error'
                  ? 'bg-rose-950 text-rose-100 border-rose-800'
                  : t.type === 'info'
                  ? 'bg-neutral-900 text-amber-300 border-neutral-700'
                  : 'bg-neutral-950 text-white border-neutral-800'
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
