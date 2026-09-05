import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Plus,
  Image as ImageIcon,
  Layers,
  Tag,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant } from '../types';
import { getImageUrl } from '../utils/imageUrl';

export const EditProductModal: React.FC = () => {
  const { editingProduct, setEditingProduct, updateProduct, deleteProduct, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'details' | 'inventory' | 'images' | 'settings'>('details');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<'jeans' | 'shirts' | 't-shirts' | 'polo' | 'casual-wear' | 'winter-wear'>('polo');
  const [brand, setBrand] = useState('Awesome Point');
  const [price, setPrice] = useState('1200');
  const [salePrice, setSalePrice] = useState('950');
  const [fabric, setFabric] = useState('');
  const [fit, setFit] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [careInstructions, setCareInstructions] = useState<string[]>([]);
  const [newCareItem, setNewCareItem] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Images state
  const [images, setImages] = useState<{ url: string; alt: string; isPrimary?: boolean }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newSize, setNewSize] = useState('XL');
  const [newColor, setNewColor] = useState('Midnight Black');
  const [newColorCode, setNewColorCode] = useState('#191919');
  const [newStock, setNewStock] = useState('10');

  // Load product into form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setNameBn(editingProduct.nameBn || '');
      setSku(editingProduct.sku || '');
      setCategory(editingProduct.category || 'polo');
      setBrand(editingProduct.brand || 'Awesome Point');
      setPrice(String(editingProduct.price || 0));
      setSalePrice(editingProduct.salePrice ? String(editingProduct.salePrice) : '');
      setFabric(editingProduct.fabric || '');
      setFit(editingProduct.fit || '');
      setDescription(editingProduct.description || '');
      setDescriptionBn(editingProduct.descriptionBn || '');
      setCareInstructions(editingProduct.careInstructions || ['Machine wash cold', 'Line dry in shade']);
      setTags(editingProduct.tags || []);
      setIsFeatured(Boolean(editingProduct.isFeatured));
      setIsNew(Boolean(editingProduct.isNew));
      setIsActive(editingProduct.isActive !== false);
      setImages(editingProduct.images || []);
      setVariants(editingProduct.variants ? [...editingProduct.variants] : []);
      setShowDeleteConfirm(false);
      setActiveTab('details');
    }
  }, [editingProduct]);

  if (!editingProduct) return null;

  const handleClose = () => {
    setEditingProduct(null);
    setShowDeleteConfirm(false);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      showToast('পণ্যের নাম খালি রাখা যাবে না', 'error');
      return;
    }

    const priceNum = Math.max(0, parseFloat(price) || 0);
    const saleNum = salePrice.trim() ? Math.max(0, parseFloat(salePrice) || 0) : undefined;

    if (variants.length === 0) {
      showToast('অন্তত একটি সাইজ ভ্যারিয়েন্ট রাখা আবশ্যক', 'error');
      return;
    }

    const categoryLabels: Record<typeof category, string> = {
      jeans: 'জিন্স ও ডেনিম',
      shirts: 'অক্সফোর্ড শার্ট',
      't-shirts': 'বক্সি টি-শার্ট',
      polo: 'পিক পোলো',
      'casual-wear': 'ইউটিলিটি কার্গো',
      'winter-wear': 'উইন্টার ওয়্যার',
    };

    // Ensure at least one primary image
    const finalImages = images.length > 0 ? images : [
      {
        url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=1000&auto=format&fit=crop',
        alt: name,
        isPrimary: true,
      },
    ];
    if (!finalImages.some((img) => img.isPrimary)) {
      finalImages[0].isPrimary = true;
    }

    const updatedProductData: Partial<Product> = {
      name: name.trim(),
      nameBn: nameBn.trim() || undefined,
      sku: sku.trim() || editingProduct.sku,
      category,
      categoryLabel: categoryLabels[category] || category.toUpperCase(),
      brand: brand.trim() || 'Awesome Point',
      price: priceNum,
      salePrice: saleNum,
      fabric: fabric.trim() || editingProduct.fabric,
      fit: fit.trim() || editingProduct.fit,
      description: description.trim(),
      descriptionBn: descriptionBn.trim() || undefined,
      careInstructions,
      tags,
      isFeatured,
      isNew,
      isActive,
      images: finalImages,
      variants,
    };

    updateProduct(editingProduct.id, updatedProductData);
    setEditingProduct(null);
  };

  const handleDelete = () => {
    deleteProduct(editingProduct.id);
    setEditingProduct(null);
  };

  // Care instructions helpers
  const addCareInstruction = () => {
    if (newCareItem.trim()) {
      setCareInstructions((prev) => [...prev, newCareItem.trim()]);
      setNewCareItem('');
    }
  };

  const removeCareInstruction = (index: number) => {
    setCareInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  // Tag helpers
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags((prev) => [...prev, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Image helpers
  const addImage = () => {
    if (newImageUrl.trim()) {
      const isFirst = images.length === 0;
      setImages((prev) => [
        ...prev,
        {
          url: newImageUrl.trim(),
          alt: newImageAlt.trim() || `${name} view`,
          isPrimary: isFirst,
        },
      ]);
      setNewImageUrl('');
      setNewImageAlt('');
    }
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // Variant helpers
  const updateVariant = (variantId: string, field: keyof ProductVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (variantId: string) => {
    if (variants.length <= 1) {
      showToast('পণ্যে অন্তত একটি সাইজ থাকতে হবে', 'error');
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const addVariant = () => {
    if (!newSize.trim()) return;
    const stockQty = Math.max(0, parseInt(newStock) || 0);
    const newVariantId = `v-${editingProduct.id}-${Date.now().toString().slice(-4)}`;
    const newVar: ProductVariant = {
      id: newVariantId,
      productId: editingProduct.id,
      sku: `AP-${category.slice(0, 3).toUpperCase()}-${newSize.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      size: newSize.trim(),
      color: newColor.trim() || 'Standard',
      colorCode: newColorCode || '#222222',
      stockQuantity: stockQty,
    };
    setVariants((prev) => [...prev, newVar]);
    showToast(`সাইজ ${newSize} যুক্ত করা হয়েছে`, 'success');
  };

  // Discount calculation
  const pNum = parseFloat(price) || 0;
  const sNum = parseFloat(salePrice) || 0;
  const discountPercent = pNum > 0 && sNum > 0 && sNum < pNum ? Math.round(((pNum - sNum) / pNum) * 100) : 0;

  return (
    <div
      id="edit-product-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 tracking-tight">
                  পণ্য সম্পাদনা
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-bold">
                  এসকেইউ: {editingProduct.sku}
                </span>
                {!isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                    ড্রাফট / নিষ্ক্রিয়
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 line-clamp-1">
                {editingProduct.nameBn || editingProduct.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-neutral-200 px-4 sm:px-6 pt-2 shrink-0 bg-white overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>পণ্যের বিবরণ ও মূল্য</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>সাইজ ও ইনভেন্টরি ({variants.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'images'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ছবির গ্যালারি ({images.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>ট্যাগ ও স্টোর প্রদর্শন</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: PRODUCT DETAILS & PRICING */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name EN */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    পণ্যের নাম (ইংরেজি) *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="যেমন: Heavyweight 240 GSM Boxy Tee"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                {/* Name BN */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    পণ্যের নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: হেভিওয়েট ২৪০ জিএসএম বক্সি টি-শার্ট"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none"
                  >
                    <option value="polo">পোলো (পিক পোলো)</option>
                    <option value="t-shirts">টি-শার্ট (বক্সি ও হেভিওয়েট)</option>
                    <option value="shirts">শার্ট (অক্সফোর্ড পিনপয়েন্ট)</option>
                    <option value="jeans">জিন্স (ব্যাগি ও টিন্ট ওয়াশড)</option>
                    <option value="casual-wear">ক্যাজুয়াল ওয়্যার (কার্গো ও ট্রাউজার)</option>
                    <option value="winter-wear">উইন্টার ওয়্যার (জ্যাকেট ও হুডি)</option>
                  </select>
                </div>

                {/* Regular Price */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    নিয়মিত মূল মূল্য (৳) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sale Price */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      ছাড়ের মূল্য (৳)
                    </label>
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-md">
                        {discountPercent}% ছাড়
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="ছাড় না থাকলে ফাঁকা রাখুন"
                      min="0"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric & Fit Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    কাপড় ও ওজনের বিবরণ
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="যেমন: ২৪০ জিএসএম ১০০% কম্বড কম্প্যাক্ট কটন"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    ফিটিং ও সিলুয়েট
                  </label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="যেমন: বক্সি ওভারসাইজড ড্রপ শোল্ডার"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  পণ্যের বিবরণ (ইংরেজি)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe garment cut, tactile finish, styling notes..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Description BN */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  পণ্যের বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="পোশাকের কাটিং, টেক্সচার ও বিবরণ বাংলায় লিখুন..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  যত্ন ও ধোয়ার নির্দেশিকা
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {careInstructions.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeCareInstruction(idx)}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCareItem}
                    onChange={(e) => setNewCareItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCareInstruction();
                      }
                    }}
                    placeholder="ধোয়ার নিয়ম লিখুন (যেমন: ঠান্ডা পানিতে উল্টো করে ধোবেন)"
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCareInstruction}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIZES & INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    সাইজভিত্তিক স্টক ম্যাট্রিক্স
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    প্রতিটি সাইজের জন্য এসকেইউ (SKU), সাইজ ট্যাগ, রঙের কোড ও স্টক সংখ্যা নিয়ন্ত্রণ করুন।
                  </span>
                </div>
                <span className="text-xs font-bold text-neutral-700">
                  মোট স্টক: {variants.reduce((sum, v) => sum + v.stockQuantity, 0)} পিস
                </span>
              </div>

              {/* Variants Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 bg-white">
                <div className="grid grid-cols-12 gap-2 p-3 bg-neutral-100/70 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  <span className="col-span-2">সাইজ</span>
                  <span className="col-span-3">এসকেইউ</span>
                  <span className="col-span-3">রং ও সোয়াচ</span>
                  <span className="col-span-3">স্টক সংখ্যা</span>
                  <span className="col-span-1 text-right">অ্যাকশন</span>
                </div>

                {variants.map((v) => (
                  <div key={v.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-neutral-50/50">
                    {/* Size */}
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => updateVariant(v.id, 'size', e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-900"
                      />
                    </div>

                    {/* SKU */}
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs text-neutral-800 font-mono"
                      />
                    </div>

                    {/* Color and Hex */}
                    <div className="col-span-3 flex items-center gap-1.5">
                      <input
                        type="color"
                        value={v.colorCode || '#222222'}
                        onChange={(e) => updateVariant(v.id, 'colorCode', e.target.value)}
                        className="w-6 h-6 rounded-md border border-neutral-300 p-0 cursor-pointer shrink-0"
                        title="রং নির্বাচন"
                      />
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(v.id, 'color', e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs text-neutral-800"
                        placeholder="রঙের নাম"
                      />
                    </div>

                    {/* Stock Stepper */}
                    <div className="col-span-3 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateVariant(v.id, 'stockQuantity', Math.max(0, v.stockQuantity - 1))
                        }
                        className="w-7 h-7 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-bold text-xs flex items-center justify-center shrink-0"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={v.stockQuantity}
                        onChange={(e) =>
                          updateVariant(
                            v.id,
                            'stockQuantity',
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        className={`w-14 text-center font-bold text-xs py-1 border rounded-md ${
                          v.stockQuantity === 0
                            ? 'border-rose-300 bg-rose-50 text-rose-700'
                            : v.stockQuantity <= 3
                            ? 'border-amber-300 bg-amber-50 text-amber-800'
                            : 'border-neutral-300 bg-white text-neutral-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateVariant(v.id, 'stockQuantity', v.stockQuantity + 1)
                        }
                        className="w-7 h-7 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-bold text-xs flex items-center justify-center shrink-0"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Variant */}
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                        title="সাইজটি মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Variant Row */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-neutral-600" />
                  <span>নতুন সাইজ ভ্যারিয়েন্ট যোগ করুন</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      সাইজ ট্যাগ
                    </label>
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="যেমন: 34 বা XXL"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      রঙের নাম
                    </label>
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="যেমন: Washed Black"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      কালার হেক্স কোড
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={newColorCode}
                        onChange={(e) => setNewColorCode(e.target.value)}
                        className="w-8 h-7.5 rounded-md border border-neutral-300 p-0 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={newColorCode}
                        onChange={(e) => setNewColorCode(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1.5 text-xs text-neutral-900 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      প্রারম্ভিক স্টক
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={addVariant}
                      className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      + সাইজ যোগ করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE GALLERY */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    পণ্যের ছবির গ্যালারি
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    অসাম পয়েন্টের মাল্টি-অ্যাঙ্গেল ছবি: প্রধান ছবি, কাপড়ের ক্লোজ-আপ এবং মডেল ফিট।
                  </span>
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {images.length}টি ছবি যুক্ত আছে
                </span>
              </div>

              {/* Existing Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border p-2 bg-neutral-50 flex flex-col justify-between group transition-all ${
                      img.isPrimary ? 'border-neutral-900 ring-2 ring-neutral-900/10' : 'border-neutral-200'
                    }`}
                  >
                    <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-neutral-100 mb-2">
                      <img
                        src={getImageUrl(img.url)}
                        alt={img.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-neutral-950 text-amber-400 text-[9px] font-extrabold shadow-sm">
                          প্রধান ছবি
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="ছবি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setImages((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, alt: val } : item))
                          );
                        }}
                        placeholder="ছবির বিবরণ"
                        className="w-full bg-white border border-neutral-300 rounded-md px-2 py-1 text-[11px] text-neutral-700"
                      />
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className="w-full py-1 text-[10px] font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md transition-colors"
                        >
                          প্রধান ছবি করুন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Image URL Box */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <span className="text-xs font-bold text-neutral-900 block">
                  নতুন ছবির ইউআরএল (URL) যোগ করুন
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="ছবির সরাসরি লিঙ্ক দিন (যেমন: Unsplash বা CDN)"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      placeholder="ছবির ক্যাপশন (যেমন: কাপড়ের ক্লোজ-আপ)"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>গ্যালারিতে ছবি যোগ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TAGS & VISIBILITY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Badges and toggles */}
              <div className="space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                  স্টোরে প্রদর্শন ও ব্যাজ সেটিংস
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Is Active */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        পণ্যটি লাইভ ও সক্রিয়
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        গ্রাহকদের জন্য প্রদর্শিত হবে
                      </span>
                    </div>
                  </label>

                  {/* Is Featured */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        ফিচার্ড পণ্য
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        হোমপেজের স্পটলাইটে থাকবে
                      </span>
                    </div>
                  </label>

                  {/* Is New */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        নতুন আগমন ব্যাজ
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        'নতুন' ব্যাজ প্রদর্শিত হবে
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  সার্চ ও ফিল্টার ট্যাগ
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-medium"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="ট্যাগ লিখুন (যেমন: ডেনিম, ওভারসাইজড, ক্যাজুয়াল)"
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    ট্যাগ যুক্ত করুন
                  </button>
                </div>
              </div>

              {/* Danger Zone: Delete Product */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-900 block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>বিপদজনক জোন: পণ্যটি মুছে ফেলুন</span>
                    </span>
                    <span className="text-[11px] text-rose-700">
                      ক্যাটালগ ও সকল সক্রিয় ক্যাটাগরি থেকে পণ্যটি চিরতরে মুছে ফেলা হবে।
                    </span>
                  </div>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors shrink-0"
                    >
                      পণ্য মুছুন
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        হ্যাঁ, মুছে ফেলুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 text-xs font-bold rounded-xl"
                      >
                        বাতিল
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-500">
            <span>পণ্যের আইডি: </span>
            <span className="font-mono text-neutral-700">{editingProduct.id}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-colors"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              className="px-5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
