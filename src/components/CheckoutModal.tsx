import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DELIVERY_ZONES } from '../data/mockData';
import { Order, Coupon } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onOrderComplete }) => {
  const {
    cart,
    cartSubtotal,
    placeOrder,
    applyCoupon,
    loyalty,
    setIsTrackingOpen,
    setViewMode,
  } = useStore();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka' | 'express'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [transactionId, setTransactionId] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Loyalty points redemption
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const loyaltyDiscountValue = Math.min(100, loyalty.points); // 100 points = ৳100 discount

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculate fees
  const selectedZone = DELIVERY_ZONES.find((z) => z.id === deliveryZone) || DELIVERY_ZONES[0];
  // Check if free delivery applies (Dhaka + Subtotal >= 1500)
  const isFreeDeliveryQualified = deliveryZone === 'inside_dhaka' && cartSubtotal >= 1500;
  const deliveryFee = isFreeDeliveryQualified ? 0 : selectedZone.fee;

  const totalDiscount = couponDiscount + (useLoyaltyPoints ? loyaltyDiscountValue : 0);
  const grandTotal = Math.max(0, cartSubtotal - totalDiscount + deliveryFee);
  const pointsToEarn = Math.floor(grandTotal / 10);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput, cartSubtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discount);
      setCouponMessage(res.message);
    } else {
      setCouponMessage(res.message);
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput('');
    setCouponMessage('');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।');
      return;
    }

    // Phone validation for Bangladesh (01...)
    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 10) {
      setFormError('ডেলিভারি কনফার্মেশনের জন্য সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (!fullAddress.trim()) {
      setFormError('অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা দিন।');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      setFormError(`অনুগ্রহ করে আপনার ${paymentMethod.toUpperCase()} ট্রানজ্যাকশন আইডি (TrxID) প্রদান করুন।`);
      return;
    }

    setIsSubmitting(true);

    try {
      const order = placeOrder({
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: {
          district,
          area: area.trim() || district,
          fullAddress: fullAddress.trim(),
          deliveryNote: deliveryNote.trim() || undefined,
        },
        deliveryZone,
        deliveryFee,
        paymentMethod,
        transactionId: transactionId.trim() || undefined,
        appliedCoupon,
        discountAmount: totalDiscount,
        useLoyaltyPoints: useLoyaltyPoints ? loyaltyDiscountValue : 0,
      });

      setCompletedOrder(order);
    } catch (err: any) {
      setFormError(err.message || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully completed
  if (completedOrder) {
    return (
      <div className="fixed inset-0 z-60 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-emerald-600">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে
            </span>
            <h2 className="text-2xl font-black text-neutral-950">
              ধন্যবাদ, {completedOrder.customerName}!
            </h2>
            <p className="text-xs text-neutral-500">
              আপনার পণ্যগুলো প্রস্তুত করা হচ্ছে। আমাদের ডেলিভারি প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">অর্ডার নম্বর:</span>
              <strong className="text-neutral-900 font-mono text-sm">
                {completedOrder.orderNumber}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">পেমেন্ট মেথড:</span>
              <strong className="text-neutral-900">
                {completedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)' : completedOrder.paymentMethod.toUpperCase()}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">সর্বমোট প্রদেয়:</span>
              <strong className="text-neutral-950 font-bold text-sm">
                ৳{completedOrder.total.toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ডেলিভারি ঠিকানা:</span>
              <span className="text-neutral-800 text-right font-medium max-w-[200px]">
                {completedOrder.deliveryAddress.fullAddress}, {completedOrder.deliveryAddress.district}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-200 text-amber-700 font-semibold">
              <span>অসাম ক্লাব পয়েন্ট:</span>
              <span>+{completedOrder.loyaltyPointsEarned} পয়েন্ট যোগ হয়েছে!</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              id="track-new-order-btn"
              onClick={() => {
                onOrderComplete();
                setIsTrackingOpen(true);
              }}
              className="w-full py-3 px-4 bg-neutral-950 text-white text-xs sm:text-sm font-bold tracking-wider rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Package className="w-4 h-4" />
              <span>লাইভ অর্ডার ট্র্যাক করুন</span>
            </button>

            <button
              onClick={() => {
                onOrderComplete();
                setViewMode('store');
              }}
              className="w-full py-2.5 px-4 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              আরও কেনাকাটা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-[11px] font-black">
              <span className="text-amber-400 mr-0.5">অ</span>প
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-950">
                নিরাপদ চেকআউট
              </h3>
              <p className="text-[11px] text-neutral-500">
                সারাদেশে ক্যাশ অন ডেলিভারিতে দ্রুত অর্ডার করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form & Summary */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left 7 cols: Customer & Address Information */}
            <div className="md:col-span-7 space-y-5">
              {/* Customer Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                    ১
                  </span>
                  <span>গ্রাহকের তথ্য</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      আপনার পুরো নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="যেমন: তানভীর হোসেন"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    ইমেইল অ্যাড্রেস (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com (অর্ডার রসিদ পাওয়ার জন্য)"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                    ২
                  </span>
                  <span>ডেলিভারি ঠিকানা</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      জেলা *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setDistrict(newDist);
                        if (newDist === 'Dhaka' || newDist === 'ঢাকা') {
                          setDeliveryZone('inside_dhaka');
                        } else {
                          setDeliveryZone('outside_dhaka');
                        }
                      }}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                    >
                      <option value="Dhaka">ঢাকা (Dhaka)</option>
                      <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
                      <option value="Sylhet">সিলেট (Sylhet)</option>
                      <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                      <option value="Khulna">খুলনা (Khulna)</option>
                      <option value="Barisal">বরিশাল (Barisal)</option>
                      <option value="Rangpur">রংপুর (Rangpur)</option>
                      <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                      <option value="Gazipur">গাজীপুর (Gazipur)</option>
                      <option value="Narayanganj">নারায়ণগঞ্জ (Narayanganj)</option>
                      <option value="Comilla">কুমিল্লা (Comilla)</option>
                      <option value="Other">অন্যান্য জেলা</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      থানা / এলাকা *
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="যেমন: ধানমন্ডি / মিরপুর / জিইসি"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    সম্পূর্ণ ঠিকানা (বাসা/রোড/ফ্ল্যাট নং) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="বাড়ি নং ৪২, রোড নং ৭, ব্লক সি, ফ্ল্যাট ৪বি..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    বিশেষ ডেলিভারি নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="যেমন: আসার পূর্বে কল করবেন, রাত ৮টার পর ডেলিভারি..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-xs text-neutral-900 focus:outline-none"
                  />
                </div>

                {/* Delivery Zone Selection Options */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-semibold text-neutral-700 block">
                    ডেলিভারি জোন বেছে নিন
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {DELIVERY_ZONES.map((zone) => {
                      const isSelected = deliveryZone === zone.id;
                      const isFree = zone.id === 'inside_dhaka' && cartSubtotal >= 1500;
                      return (
                        <div
                          key={zone.id}
                          onClick={() => setDeliveryZone(zone.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                              : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{zone.name}</span>
                            <span>{isFree ? 'ফ্রি' : `৳${zone.fee}`}</span>
                          </div>
                          <span
                            className={`text-[10px] block mt-0.5 ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {zone.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                    ৩
                  </span>
                  <span>পেমেন্ট মাধ্যম</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-md'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                    <span className="text-[9px] font-normal opacity-80">পণ্য পেয়ে টাকা দিন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-[#e2136e] text-white border-[#e2136e] shadow-md'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>বিকাশ (bKash)</span>
                    <span className="text-[9px] font-normal opacity-80">সেন্ড মানি / TrxID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'nagad'
                        ? 'bg-[#f7941d] text-white border-[#f7941d] shadow-md'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>নগদ (Nagad)</span>
                    <span className="text-[9px] font-normal opacity-80">দ্রুত পেমেন্ট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-md'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>কার্ড / ভিসা / মাস্টারকার্ড</span>
                    <span className="text-[9px] font-normal opacity-80">তাৎক্ষণিক</span>
                  </button>
                </div>

                {/* Instructions for bKash / Nagad */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="p-3.5 bg-neutral-100 rounded-xl border border-neutral-300 text-xs space-y-2">
                    <p className="font-semibold text-neutral-900">
                      {paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} পেমেন্ট করার নির্দেশিকা:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-neutral-700 text-[11px]">
                      <li>
                        আপনার {paymentMethod === 'bkash' ? 'বিকাশ অ্যাপে যান অথবা *247#' : 'নগদ অ্যাপে যান অথবা *167#'} ডায়াল করুন।
                      </li>
                      <li>
                        মোট মূল্য <strong>৳{grandTotal.toLocaleString()}</strong> আমাদের নম্বরে পাঠান: <strong>01711-420420</strong> (পার্সোনাল / মার্চেন্ট)।
                      </li>
                      <li>রেফারেন্স দিন: <strong>AWESOMEPOINT</strong>।</li>
                      <li>ট্রানজ্যাকশন সম্পন্ন করে TrxID নিচে লিখুন:</li>
                    </ol>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="যেমন: 9B7X24K91M"
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-mono uppercase focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 cols: Order Items & Pricing Breakdown */}
            <div className="md:col-span-5 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 tracking-wider pb-2 border-b border-neutral-200">
                  অর্ডারের আইটেম ({cart.length}টি)
                </h4>

                {/* Mini Item List */}
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((item) => {
                    const unitPrice =
                      item.variant.salePrice ?? item.product.salePrice ?? item.product.price;
                    return (
                      <div key={item.id} className="flex items-center gap-2.5 text-xs">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.nameBn || item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 rounded object-cover bg-neutral-200 border border-neutral-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-neutral-900 truncate">{item.product.nameBn || item.product.name}</p>
                          <p className="text-[11px] text-neutral-500">
                            সাইজ: {item.variant.size} • পরিমাণ: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-neutral-900">
                          ৳{(unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Box */}
                <div className="pt-2 border-t border-neutral-200 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="কুপন কোড (যেমন: AWESOME10)"
                      className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs uppercase focus:border-neutral-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
                    >
                      প্রয়োগ
                    </button>
                  </div>

                  {couponMessage && (
                    <p
                      className={`text-[11px] ${
                        appliedCoupon ? 'text-emerald-700 font-medium' : 'text-rose-600'
                      }`}
                    >
                      {couponMessage}
                    </p>
                  )}

                  {/* Loyalty Points Redemption option */}
                  {loyalty.points >= 100 && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="use-loyalty"
                          checked={useLoyaltyPoints}
                          onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                          className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950"
                        />
                        <label htmlFor="use-loyalty" className="cursor-pointer">
                          <span className="font-bold">১০০ ক্লাব পয়েন্ট ব্যবহার করুন</span>
                          <span className="block text-[10px] text-amber-700">
                            (বর্তমান পয়েন্ট: {loyalty.points})
                          </span>
                        </label>
                      </div>
                      <span className="font-extrabold text-amber-800">-৳১০০</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-200 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>সাবটোটাল</span>
                    <span>৳{cartSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>ডেলিভারি চার্জ</span>
                    <span>
                      {isFreeDeliveryQualified ? (
                        <span className="text-emerald-700 font-bold">ফ্রি (৳১,৫০০+ অর্ডারে)</span>
                      ) : (
                        `৳${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        কুপন ছাড় ({appliedCoupon?.code})
                      </span>
                      <span>-৳{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  {useLoyaltyPoints && (
                    <div className="flex justify-between text-amber-700 font-semibold">
                      <span>ক্লাব পয়েন্ট ছাড়</span>
                      <span>-৳{loyaltyDiscountValue.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm sm:text-base font-black text-neutral-950 pt-2 border-t border-neutral-300">
                    <span>সর্বমোট প্রদেয়</span>
                    <span>৳{grandTotal.toLocaleString()}</span>
                  </div>

                  <div className="text-[11px] text-neutral-500 text-right pt-0.5">
                    অর্ডারে পাবেন <strong>+{pointsToEarn} ক্লাব পয়েন্ট</strong>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-2">
                <button
                  id="checkout-confirm-place-order-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-neutral-950 text-white font-bold text-xs sm:text-sm tracking-wider rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>অর্ডার প্রক্রিয়াধীন...</span>
                  ) : (
                    <>
                      <span>
                        অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString()})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>তথ্য সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
