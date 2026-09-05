import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Calendar,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onClose?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderNumber,
  onClose,
}) => {
  const { orders, findOrder, setIsTrackingOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber || '');
  const [activeOrder, setActiveOrder] = useState<Order | undefined>(() => {
    if (initialOrderNumber) {
      return findOrder(initialOrderNumber);
    }
    return orders[0]; // Default to most recent order for immediate inspection
  });
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (initialOrderNumber) {
      const found = findOrder(initialOrderNumber);
      if (found) setActiveOrder(found);
    }
  }, [initialOrderNumber, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchQuery.trim()) return;

    const found = findOrder(searchQuery);
    if (found) {
      setActiveOrder(found);
    } else {
      setSearchError(
        `"${searchQuery}" দিয়ে কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নম্বর (যেমন: #AP-10842) অথবা মোবাইল নম্বর প্রদান করুন।`
      );
    }
  };

  const statusStepMap: Record<Order['status'], number> = {
    pending: 1,
    confirmed: 2,
    processing: 2,
    packed: 3,
    shipped: 4,
    out_for_delivery: 5,
    delivered: 6,
    cancelled: 0,
  };

  const currentStep = activeOrder ? statusStepMap[activeOrder.status] : 1;

  const steps = [
    { title: 'অর্ডার গ্রহণ', subtitle: 'অনলাইনে গৃহীত' },
    { title: 'কনফার্মড', subtitle: 'যাচাই ও সংরক্ষিত' },
    { title: 'প্যাকেজিং', subtitle: 'অসাম বক্স প্রস্তুত' },
    { title: 'কুরিয়ারে হস্তান্তর', subtitle: 'শিপমেন্টে পাঠানো' },
    { title: 'ডেলিভারিতে বের হয়েছে', subtitle: 'রাইডার পথে রয়েছে' },
    { title: 'ডেলিভার্ড', subtitle: 'হাতে পৌঁছে দেওয়া হয়েছে' },
  ];

  const getBanglaStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'অপেক্ষমাণ (Pending)';
      case 'confirmed': return 'কনফার্মড (Confirmed)';
      case 'processing': return 'প্রক্রিয়াধীন (Processing)';
      case 'packed': return 'প্যাকেজিং সম্পন্ন (Packed)';
      case 'shipped': return 'কুরিয়ারে চলমান (Shipped)';
      case 'out_for_delivery': return 'ডেলিভারিতে বের হয়েছে';
      case 'delivered': return 'ডেলিভার্ড সম্পন্ন';
      case 'cancelled': return 'বাতিল করা হয়েছে';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-950">
                লাইভ অর্ডার ট্র্যাকিং
              </h2>
              <p className="text-xs text-neutral-500">
                স্টেডফাস্ট ও পাঠাও কুরিয়ারের মাধ্যমে রিয়েল-টাইম পার্সেল আপডেট
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onClose) onClose();
              else setIsTrackingOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অর্ডার আইডি (যেমন: #AP-10842) বা মোবাইল নম্বর (017...)"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
              >
                ট্র্যাক করুন
              </button>
            </div>

            {/* Quick Demo Pre-fill Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-500">
              <span>ডেমো ট্র্যাকিং দেখুন:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('#AP-10842');
                  setActiveOrder(findOrder('#AP-10842'));
                  setSearchError('');
                }}
                className="font-mono text-[11px] bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded text-neutral-800 font-semibold"
              >
                #AP-10842 (কুরিয়ারে চলমান)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('#AP-10799');
                  setActiveOrder(findOrder('#AP-10799'));
                  setSearchError('');
                }}
                className="font-mono text-[11px] bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded text-neutral-800 font-semibold"
              >
                #AP-10799 (ডেলিভার্ড)
              </button>
            </div>

            {searchError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}
          </form>

          {/* Active Order Details */}
          {activeOrder ? (
            <div className="space-y-6">
              {/* Order Status Banner */}
              <div className="p-4 sm:p-5 bg-neutral-950 text-white rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-mono">
                      অর্ডার আইডি: {activeOrder.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        activeOrder.status === 'delivered'
                          ? 'bg-emerald-500 text-white'
                          : activeOrder.status === 'cancelled'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-400 text-neutral-950'
                      }`}
                    >
                      {getBanglaStatusText(activeOrder.status)}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight mt-1">
                    {activeOrder.status === 'delivered'
                      ? 'পার্সেল সফলভাবে ডেলিভারি সম্পন্ন হয়েছে'
                      : activeOrder.status === 'shipped'
                      ? 'কুরিয়ারে ট্রানজিটে রয়েছে'
                      : activeOrder.status === 'packed'
                      ? 'কুরিয়ার পিকআপের জন্য প্রস্তুত'
                      : 'অর্ডার প্রক্রিয়াকরণ চলছে'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    সম্ভাব্য ডেলিভারি তারিখ: <strong>{activeOrder.estimatedDelivery}</strong>
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-6 text-xs text-neutral-300">
                  <span className="block text-neutral-400 text-[10px]">পেমেন্ট মেথড</span>
                  <span className="font-bold text-sm text-white">
                    {activeOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (COD)' : activeOrder.paymentMethod.toUpperCase()}
                  </span>
                  <span className="block text-amber-300 font-semibold mt-0.5">
                    সর্বমোট: ৳{activeOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div className="bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-200">
                <h4 className="text-xs font-bold text-neutral-900 tracking-wider mb-5">
                  শিপমেন্টের অগ্রগতি
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 -z-0" />
                  <div
                    className="hidden sm:block absolute top-4 left-6 h-0.5 bg-neutral-950 transition-all duration-500 -z-0"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 100)
                      )}%`,
                    }}
                  />

                  {/* Steps Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2">
                    {steps.map((st, sIdx) => {
                      const stepNumber = sIdx + 1;
                      const isComplete = currentStep >= stepNumber;
                      const isCurrent = currentStep === stepNumber;

                      return (
                        <div
                          key={sIdx}
                          className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative z-10"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                              isComplete
                                ? 'bg-neutral-950 text-white shadow-xs'
                                : 'bg-neutral-200 text-neutral-500'
                            } ${isCurrent ? 'ring-4 ring-neutral-300' : ''}`}
                          >
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : stepNumber}
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isComplete ? 'text-neutral-950' : 'text-neutral-400'
                              }`}
                            >
                              {st.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">
                              {st.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Courier & Tracking Details */}
              {activeOrder.courierTracking && (
                <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl text-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-700" />
                      <span className="font-bold text-amber-950">
                        {activeOrder.courierTracking.courierName}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-neutral-900">
                      ট্র্যাকিং কোড: {activeOrder.courierTracking.trackingCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 block">
                        বর্তমান হাব / লোকেশন
                      </span>
                      <p className="font-semibold text-neutral-900">
                        {activeOrder.courierTracking.currentHub}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 block">
                        কুরিয়ার হেল্পলাইন
                      </span>
                      <p className="font-semibold text-neutral-900">
                        {activeOrder.courierTracking.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items Snapshot & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <MapPin className="w-4 h-4 text-neutral-700" />
                    <span>ডেলিভারি ঠিকানা</span>
                  </div>
                  <p className="font-bold text-neutral-900">{activeOrder.customerName}</p>
                  <p className="text-neutral-600">{activeOrder.customerPhone}</p>
                  <p className="text-neutral-700">
                    {activeOrder.deliveryAddress.fullAddress}, {activeOrder.deliveryAddress.area},{' '}
                    {activeOrder.deliveryAddress.district}
                  </p>
                  {activeOrder.deliveryAddress.deliveryNote && (
                    <p className="text-[11px] text-neutral-500 italic bg-white p-2 rounded border border-neutral-200">
                      নোট: "{activeOrder.deliveryAddress.deliveryNote}"
                    </p>
                  )}
                </div>

                {/* Ordered Items List */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <Package className="w-4 h-4 text-neutral-700" />
                    <span>শিপমেন্টের আইটেমসমূহ</span>
                  </div>

                  <div className="space-y-2">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-neutral-200">
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 rounded object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-neutral-900 truncate text-[11px]">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            সাইজ: {item.size} • রঙ: {item.color} • পরিমাণ: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-neutral-950 text-xs">
                          ৳{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500 text-xs">
              ট্র্যাকিংয়ের বিস্তারিত দেখতে আপনার অর্ডার আইডি বা মোবাইল নম্বর দিয়ে সার্চ করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
