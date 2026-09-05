import React, { useState } from 'react';
import {
  Package,
  Boxes,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowLeft,
  DollarSign,
  Truck,
  Users,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, Order } from '../types';
import { EditProductModal } from './EditProductModal';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    loyalty,
    updateVariantStock,
    updateOrderStatus,
    addNewProduct,
    editingProduct,
    setEditingProduct,
    setViewMode,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add-product'>('inventory');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low' | 'out'>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // New Product Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'jeans' | 'shirts' | 't-shirts' | 'polo' | 'casual-wear' | 'winter-wear'>('jeans');
  const [newPrice, setNewPrice] = useState('1100');
  const [newSalePrice, setNewSalePrice] = useState('850');
  const [newFabric, setNewFabric] = useState('13.5 Oz 100% Rigid Denim');
  const [newFit, setNewFit] = useState('Semi Baggy Straight');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=1000&auto=format&fit=crop');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0);

  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stockQuantity > 0 && v.stockQuantity <= 3)
      .map((v) => ({ product: p, variant: v }))
  );

  const outOfStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.stockQuantity === 0).map((v) => ({ product: p, variant: v }))
  );

  // Filtered inventory list
  const filteredProducts = products.filter((p) => {
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (inventoryFilter === 'low') {
      return p.variants.some((v) => v.stockQuantity > 0 && v.stockQuantity <= 3);
    }
    if (inventoryFilter === 'out') {
      return p.variants.some((v) => v.stockQuantity === 0);
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const priceNum = parseFloat(newPrice) || 1000;
    const saleNum = parseFloat(newSalePrice) || 800;
    const prodId = `prod-${Date.now()}`;
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const sizes = newCategory === 'jeans' || newCategory === 'casual-wear'
      ? ['28', '30', '32', '34', '36']
      : ['M', 'L', 'XL', 'XXL'];

    const newVariants: ProductVariant[] = sizes.map((s, idx) => ({
      id: `v-${prodId}-${s}`,
      productId: prodId,
      sku: `AP-${s.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      size: s,
      color: 'Standard Dark',
      colorCode: '#222222',
      stockQuantity: 10,
    }));

    const newProd: Product = {
      id: prodId,
      name: newName.trim(),
      slug,
      sku: `AP-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      categoryLabel: newCategory.toUpperCase(),
      brand: 'Awesome Point',
      fabric: newFabric,
      fit: newFit,
      price: priceNum,
      salePrice: saleNum,
      isActive: true,
      isNew: true,
      description: `Premium garment crafted for everyday comfort and durability by Awesome Point Dhaka.`,
      careInstructions: ['Machine wash cold', 'Line dry in shade', 'Warm iron'],
      rating: 5.0,
      reviewCount: 1,
      tags: [newCategory, 'new-arrival'],
      sizeChartId: newCategory === 'jeans' ? 'jeans-chart' : 'tops-chart',
      images: [
        {
          url: newImageUrl,
          alt: newName,
          isPrimary: true,
        },
      ],
      variants: newVariants,
    };

    addNewProduct(newProd);
    setNewName('');
    setActiveTab('inventory');
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-black">
              <span className="text-amber-400 mr-0.5">A</span>P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-neutral-950">
                  অসাম পয়েন্ট অ্যাডমিন ও ইনভেন্টরি
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase">
                  লাইভ ডাটাবেজ
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                ভ্যারিয়েন্ট স্টক কন্ট্রোল, অর্ডার প্রসেসিং ও ডেলিভারি ট্র্যাকিং
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('store')}
              className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>স্টোরে ফিরে যান</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span className="font-semibold">মোট বিক্রয়</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-neutral-950">
              ৳{totalRevenue.toLocaleString()}
            </p>
            <span className="text-[10px] text-neutral-400">
              {orders.length}টি অর্ডারে
            </span>
          </div>

          {/* Active Orders */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span className="font-semibold">চলমান অর্ডার</span>
              <Truck className="w-4 h-4 text-neutral-700" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-neutral-950">
              {orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length}
            </p>
            <span className="text-[10px] text-amber-600 font-semibold">
              কুরিয়ার ডেলিভারি অপেক্ষমাণ
            </span>
          </div>

          {/* Low Stock Alert */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span className="font-semibold">কম স্টকের সাইজ</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600">
              {lowStockVariants.length}
            </p>
            <span className="text-[10px] text-neutral-400">
              ৩টি বা তার কম ইউনিট অবশিষ্ট
            </span>
          </div>

          {/* Out of stock */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span className="font-semibold">স্টক শেষ সাইজ</span>
              <Boxes className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600">
              {outOfStockVariants.length}
            </p>
            <span className="text-[10px] text-neutral-400">
              পুনরায় স্টক প্রয়োজন
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'inventory'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-white'
            }`}
          >
            সাইজভিত্তিক ইনভেন্টরি ({totalVariants}টি ভ্যারিয়েন্ট)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-white'
            }`}
          >
            <span>গ্রাহকদের অর্ডারসমূহ ({orders.length})</span>
            {orders.filter((o) => o.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
              activeTab === 'add-product'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন পণ্য যোগ করুন</span>
          </button>
        </div>

        {/* TAB 1: INVENTORY & VARIANT MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="পণ্য বা এসকেইউ (SKU) দিয়ে খুঁজুন..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-semibold">ফিল্টার:</span>
                <button
                  onClick={() => setInventoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                    inventoryFilter === 'all'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                  }`}
                >
                  সকল পণ্য
                </button>
                <button
                  onClick={() => setInventoryFilter('low')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 ${
                    inventoryFilter === 'low'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-neutral-50 text-amber-700 border-neutral-200'
                  }`}
                >
                  <span>কম স্টক (≤৩)</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {lowStockVariants.length}
                  </span>
                </button>
                <button
                  onClick={() => setInventoryFilter('out')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 ${
                    inventoryFilter === 'out'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-neutral-50 text-rose-700 border-neutral-200'
                  }`}
                >
                  <span>স্টক শেষ (০)</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {outOfStockVariants.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Products & Variants Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  ভ্যারিয়েন্ট ইনভেন্টরি ম্যাট্রিক্স (রিয়েল-টাইম স্টক কন্ট্রোল)
                </span>
                <span className="text-[11px] text-neutral-500">
                  + / - বাটনে ক্লিক করে তাৎক্ষণিক স্টক পরিবর্তন করুন।
                </span>
              </div>

              <div className="divide-y divide-neutral-200">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Product identity */}
                      <div
                        onClick={() => setEditingProduct(product)}
                        className="flex items-center gap-3.5 min-w-[280px] cursor-pointer group"
                        title="পণ্য সম্পাদনা করতে ক্লিক করুন"
                      >
                        <img
                          src={product.images[0]?.url}
                          alt={product.nameBn || product.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-16 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0 group-hover:border-neutral-900 transition-colors"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            {product.categoryLabel} • {product.sku}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
                            <span>{product.nameBn || product.name}</span>
                            <Edit2 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-neutral-950">
                              ৳{(product.salePrice ?? product.price).toLocaleString()}
                            </span>
                            {product.salePrice && product.salePrice < product.price && (
                              <span className="text-[10px] text-neutral-400 line-through">
                                ৳{product.price.toLocaleString()}
                              </span>
                            )}
                            {!product.isActive && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-600">
                                ড্রাফট
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Variant Size Stock Chips */}
                      <div className="flex-1 flex flex-wrap items-center gap-2">
                        {product.variants.map((variant) => {
                          const isLow = variant.stockQuantity > 0 && variant.stockQuantity <= 3;
                          const isSoldOut = variant.stockQuantity === 0;

                          return (
                            <div
                              key={variant.id}
                              className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                                isSoldOut
                                  ? 'bg-rose-50/60 border-rose-200'
                                  : isLow
                                  ? 'bg-amber-50/60 border-amber-200'
                                  : 'bg-white border-neutral-200'
                              }`}
                            >
                              <div className="text-left">
                                <span className="text-xs font-black text-neutral-900 block leading-none">
                                  সাইজ {variant.size}
                                </span>
                                <span
                                  className={`text-[9px] font-bold uppercase block mt-0.5 ${
                                    isSoldOut
                                      ? 'text-rose-600'
                                      : isLow
                                      ? 'text-amber-700'
                                      : 'text-neutral-400'
                                  }`}
                                >
                                  {isSoldOut ? 'স্টক শেষ' : isLow ? 'সীমিত স্টক' : 'স্টকে আছে'}
                                </span>
                              </div>

                              {/* Quick stock stepper */}
                              <div className="flex items-center bg-neutral-100 rounded-lg border border-neutral-200 ml-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateVariantStock(
                                      product.id,
                                      variant.id,
                                      Math.max(0, variant.stockQuantity - 1)
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-700 hover:bg-neutral-200 rounded-l-lg"
                                >
                                  -
                                </button>
                                <span
                                  className={`w-7 text-center text-xs font-black ${
                                    isSoldOut ? 'text-rose-600' : 'text-neutral-900'
                                  }`}
                                >
                                  {variant.stockQuantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateVariantStock(
                                      product.id,
                                      variant.id,
                                      variant.stockQuantity + 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-700 hover:bg-neutral-200 rounded-r-lg"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Edit Product Action Button */}
                      <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                          title="পণ্যের বিবরণ, দাম, ছবি ও সাইজ সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>পণ্য সম্পাদনা</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  গ্রাহকদের অর্ডারসমূহ ({orders.length})
                </span>
                <span className="text-[11px] text-neutral-500">
                  কুরিয়ার ট্র্যাকিং অনুযায়ী অর্ডারের স্ট্যাটাস আপডেট করুন
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="p-3.5">অর্ডার নম্বর</th>
                      <th className="p-3.5">গ্রাহক</th>
                      <th className="p-3.5">পণ্যসমূহ</th>
                      <th className="p-3.5">মোট ও পেমেন্ট</th>
                      <th className="p-3.5">ডেলিভারি ঠিকানা</th>
                      <th className="p-3.5">বর্তমান স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-neutral-900">
                          {ord.orderNumber}
                          <span className="block text-[10px] text-neutral-400 font-sans font-normal">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <strong className="text-neutral-900 block">{ord.customerName}</strong>
                          <span className="text-neutral-500 text-[11px]">{ord.customerPhone}</span>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            {ord.items.map((it, idx) => (
                              <span key={idx} className="block text-[11px] text-neutral-700 truncate max-w-[200px]">
                                {it.quantity}x {it.productName} ({it.size})
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5 font-semibold text-neutral-900">
                          ৳{ord.total.toLocaleString()}
                          <span className="block text-[10px] text-neutral-500 uppercase font-normal">
                            {ord.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : ord.paymentMethod.toUpperCase()} • {ord.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                          </span>
                        </td>

                        <td className="p-3.5 text-neutral-600">
                          {ord.deliveryAddress.district}
                          <span className="block text-[10px] text-neutral-400">
                            {ord.deliveryAddress.area}
                          </span>
                        </td>

                        {/* Status Select dropdown */}
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as Order['status'])
                            }
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="pending">অপেক্ষমাণ (Pending)</option>
                            <option value="confirmed">নিশ্চিত (Confirmed)</option>
                            <option value="processing">প্রসেসিং হচ্ছে</option>
                            <option value="packed">প্যাকেজিং সম্পন্ন</option>
                            <option value="shipped">শিপমেন্টে আছে (পথে)</option>
                            <option value="out_for_delivery">ডেলিভারিতে বের হয়েছে</option>
                            <option value="delivered">ডেলিভারি সম্পন্ন</option>
                            <option value="cancelled">বাতিল (স্টকে ফেরত)</option>
                          </select>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg"
                          >
                            বিবরণ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADD NEW PRODUCT */}
        {activeTab === 'add-product' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs max-w-2xl mx-auto">
            {/* Quick link to edit existing products */}
            <div className="mb-6 p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  বিদ্যমান পণ্য সম্পাদনা করতে চান?
                </span>
                <span className="text-[11px] text-amber-800">
                  আপনার ক্যাটালগের {products.length}টি পণ্যের যেকোনোটি বেছে নিয়ে দাম, ছবি বা স্টক পরিবর্তন করুন।
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) {
                      setEditingProduct(found);
                      e.target.value = '';
                    }
                  }}
                  className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 font-medium focus:outline-none"
                >
                  <option value="" disabled>
                    সম্পাদনা করতে পণ্য নির্বাচন করুন...
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameBn || p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h3 className="text-base font-black text-neutral-900 uppercase tracking-wider mb-4">
              স্টোর ক্যাটালগে নতুন পণ্য যোগ করুন
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">পণ্যের নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: অ্যাসিড স্লেট হেভিওয়েট ড্রপ-শোল্ডার টি-শার্ট"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">ক্যাটাগরি</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900"
                  >
                    <option value="jeans">জিন্স ও ডেনিম</option>
                    <option value="t-shirts">টি-শার্ট</option>
                    <option value="shirts">শার্ট</option>
                    <option value="polo">পোলো</option>
                    <option value="winter-wear">উইন্টার ওয়্যার</option>
                    <option value="casual-wear">ক্যাজুয়াল ওয়্যার</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">ফিটিং সিলুয়েট</label>
                  <input
                    type="text"
                    value={newFit}
                    onChange={(e) => setNewFit(e.target.value)}
                    placeholder="যেমন: সেমি ব্যাগি / বক্সি ওভারসাইজড"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">নিয়মিত মূল্য (৳)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">ছাড়ের বিক্রয় মূল্য (৳)</label>
                  <input
                    type="number"
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">কাপড়ের বিবরণ</label>
                <input
                  type="text"
                  value={newFabric}
                  onChange={(e) => setNewFabric(e.target.value)}
                  placeholder="যেমন: ২৪০ জিএসএম কম্বড কটন সিঙ্গেল জার্সি"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">ছবির ইউআরএল</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors shadow-md"
              >
                সাইজ ভ্যারিয়েন্টসহ নতুন পণ্য যুক্ত করুন (প্রতিটিতে ১০ ইউনিট স্টক)
              </button>
            </form>
          </div>
        )}

        {/* Selected Order Modal View */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h4 className="text-sm font-black text-neutral-900">
                  অর্ডারের বিবরণ: {selectedOrderDetails.orderNumber}
                </h4>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="text-neutral-400 hover:text-neutral-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs text-neutral-700">
                <p>
                  <strong>গ্রাহক:</strong> {selectedOrderDetails.customerName} ({selectedOrderDetails.customerPhone})
                </p>
                <p>
                  <strong>ঠিকানা:</strong> {selectedOrderDetails.deliveryAddress.fullAddress},{' '}
                  {selectedOrderDetails.deliveryAddress.area}, {selectedOrderDetails.deliveryAddress.district}
                </p>
                <p>
                  <strong>পেমেন্ট মাধ্যম:</strong> {selectedOrderDetails.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : selectedOrderDetails.paymentMethod.toUpperCase()} (
                  {selectedOrderDetails.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া'})
                </p>
                {selectedOrderDetails.transactionId && (
                  <p>
                    <strong>ট্রানজেকশন আইডি:</strong> {selectedOrderDetails.transactionId}
                  </p>
                )}
                {selectedOrderDetails.courierTracking && (
                  <p>
                    <strong>কুরিয়ার ট্র্যাকিং কোড:</strong>{' '}
                    {selectedOrderDetails.courierTracking.trackingCode} (
                    {selectedOrderDetails.courierTracking.courierName})
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs">
                <strong className="block text-neutral-900">অর্ডারকৃত পণ্যসমূহ:</strong>
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-neutral-800">
                    <span>
                      {it.quantity}x {it.productName} ({it.size})
                    </span>
                    <span className="font-bold">৳{it.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between font-black text-sm text-neutral-950">
                <span>সর্বমোট মূল্য:</span>
                <span>৳{selectedOrderDetails.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Edit Existing Product Modal */}
        {editingProduct && <EditProductModal />}
      </div>
    </div>
  );
};
