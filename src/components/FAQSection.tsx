import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Truck,
  RotateCcw,
  Ruler,
  CreditCard,
  Search,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export interface FAQItem {
  id: string;
  category: 'shipping' | 'returns' | 'sizing' | 'payment';
  question: string;
  answer: string;
  highlights?: string[];
  actionType?: 'sizeGuide' | 'tracking' | 'whatsapp';
  actionLabel?: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Shipping & Delivery
  {
    id: 'faq-ship-1',
    category: 'shipping',
    question: 'ঢাকার ভেতরে ও ঢাকার বাইরে ডেলিভারি চার্জ কত এবং কত সময় লাগে?',
    answer:
      'আমরা দ্রুততম সময়ে সারা বাংলাদেশে হোম ডেলিভারি নিশ্চিত করি। ঢাকা সিটির ভেতরে ক্যাশ অন ডেলিভারিতে চার্জ মাত্র ৮০ টাকা (২৪ থেকে ৪৮ ঘণ্টার মধ্যে হাতে পাবেন)। ঢাকার বাইরে জেলা ও থানা সদরে ডেলিভারি চার্জ ১৫০ টাকা (২ থেকে ৩ কার্যদিবস)। এছাড়া ১,৫০০ টাকা বা তার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
    highlights: [
      'ঢাকার ভেতরে: ৮০ টাকা (২৪-৪৮ ঘণ্টা)',
      'ঢাকার বাইরে: ১৫০ টাকা (২-৩ কার্যদিবস)',
      '১,৫০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি',
    ],
    actionType: 'tracking',
    actionLabel: 'পার্সেল ট্র্যাকিং দেখুন',
  },
  {
    id: 'faq-ship-2',
    category: 'shipping',
    question: 'আমি কি পার্সেল খুলে চেক করে নিতে পারব (ওপেন-বক্স ডেলিভারি)?',
    answer:
      'হ্যাঁ, ১০০% নিশ্চিত থাকুন! অসাম পয়েন্ট সকল গ্রাহককে ওপেন-বক্স ডেলিভারি সুবিধা দেয়। ডেলিভারি রাইডারের উপস্থিতিতে পার্সেল খুলে ফেব্রিকের কোয়ালিটি, সাইজ ও সেলাই নিখুঁতভাবে পরীক্ষা করে তবেই মূল্য পরিশোধ করবেন। কোনো অসঙ্গতি দেখলে তাৎক্ষণিকভাবে পার্সেল ফেরত দিতে পারবেন।',
    highlights: [
      'রাইডারের সামনে পার্সেল খুলে সাইজ ও ফেব্রিক যাচাইযোগ্য',
      'পণ্য পছন্দ হলে তবেই ক্যাশ পরিশোধ',
    ],
  },
  {
    id: 'faq-ship-3',
    category: 'shipping',
    question: 'ডেলিভারি কুরিয়ার পার্টনার কারা এবং পার্সেল কীভাবে লাইভ ট্র্যাক করব?',
    answer:
      'আমরা দেশের শীর্ষস্থানীয় লজিস্টিক পার্টনার পাঠাও (Pathao Courier), স্টেডফাস্ট (Steadfast) এবং পেপারফ্লাইয়ের প্রিমিয়াম সার্ভিসের মাধ্যমে পার্সেল পৌঁছে দিই। অর্ডার কনফার্ম হলেই আপনার ফোনে ট্র্যাকিং কোড চলে যাবে। এছাড়া ওয়েবসাইটের উপরের "ট্র্যাকিং" ট্যাবে ক্লিক করে লাইভ ডেলিভারি স্ট্যাটাস দেখতে পারবেন।',
    actionType: 'tracking',
    actionLabel: 'অর্ডার ট্র্যাক করুন',
  },

  // 2. Returns & Exchange
  {
    id: 'faq-ret-1',
    category: 'returns',
    question: 'সাইজ ঠিক না হলে কীভাবে সাইজ পরিবর্তন বা এক্সচেঞ্জ করব?',
    answer:
      'ডেলিভারি গ্রহণের ৭ দিনের মধ্যে যেকোনো পণ্য সহজ ডোরস্টেপ এক্সচেঞ্জ করতে পারবেন। আমাদের কাস্টমার কেয়ারে বা ফেসবুক/হোয়াটসঅ্যাপে জানালেই আমরা আপনার ঠিকানায় রাইডার পাঠিয়ে আগের পণ্য সংগ্রহ করে নতুন সাইজ পৌঁছে দিই। আপনাকে কোনো কুরিয়ার অফিসে গিয়ে ঝামেলা পোহাতে হবে না।',
    highlights: [
      'ডেলিভারির পর ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা',
      'সহজ ডোরস্টেপ রাইডার পিকআপ ও রিপ্লেসমেন্ট',
    ],
    actionType: 'whatsapp',
    actionLabel: 'এক্সচেঞ্জের জন্য যোগাযোগ',
  },
  {
    id: 'faq-ret-2',
    category: 'returns',
    question: 'রিটার্ন ও এক্সচেঞ্জের ক্ষেত্রে কী কী শর্ত প্রযোজ্য?',
    answer:
      'পণ্যটি অবশ্যই অব্যবহৃত, না ধোয়া এবং অরিজিনাল ট্যাগ ও প্যাক অক্ষত অবস্থায় থাকতে হবে। ত্রুটিপূর্ণ বা ভুল সাইজ ডেলিভারি হলে এক্সচেঞ্জের যাবতীয় কুরিয়ার খরচ অসাম পয়েন্ট বহন করবে। সাধারণ ব্যক্তিগত পছন্দের পরিবর্তনের ক্ষেত্রে সামান্য রিটার্ন কুরিয়ার চার্জ প্রযোজ্য হতে পারে।',
    highlights: [
      'অব্যবহৃত ও মূল ট্যাগ অক্ষত থাকতে হবে',
      'উৎপাদন ত্রুটিতে সম্পূর্ণ ফ্রি এক্সচেঞ্জ',
    ],
  },
  {
    id: 'faq-ret-3',
    category: 'returns',
    question: 'রিফান্ড পলিসি কী এবং টাকা ফেরত পেতে কত সময় লাগে?',
    answer:
      'যদি কোনো পণ্যে উৎপাদন ত্রুটি থাকে এবং আমাদের কাছে বিকল্প সাইজ বা রিপ্লেসমেন্ট স্টক না থাকে, তবে রিটার্ন পার্সেল যাচাইয়ের ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার বিকাশ, নগদ বা ব্যাংক একাউন্টে ১০০% টাকা রিফান্ড প্রদান করা হয়।',
    highlights: ['বিকাশ বা নগদে ৩-৫ কার্যদিবসে দ্রুত রিফান্ড'],
  },

  // 3. Sizing & Fit
  {
    id: 'faq-size-1',
    category: 'sizing',
    question: 'আমার জন্য সঠিক সাইজ কীভাবে বাছাই করব?',
    answer:
      'প্রতিটি পণ্যের পেজে এবং নিচে সরাসরি "সাইজ গাইড" রয়েছে। সেখানে বুক (Chest), দৈর্ঘ্য (Length), কোমর (Waist) ও হিপের সুনির্দিষ্ট মাপ ইঞ্চি ও সেন্টিমিটারে চার্ট আকারে দেওয়া আছে। আপনার পরা পছন্দের যেকোনো ভালো ফিটের পোশাকের সাথে ফিতা দিয়ে মেপে সাইজ অর্ডার করুন।',
    highlights: [
      'ইঞ্চি ও সেন্টিমিটারে বিস্তারিত সাইজ চার্ট',
      'বুক ও কোমরের মাপ অনুযায়ী সুনির্দিষ্ট সাইজ',
    ],
    actionType: 'sizeGuide',
    actionLabel: 'সাইজ গাইড চার্ট খুলুন',
  },
  {
    id: 'faq-size-2',
    category: 'sizing',
    question: 'অসাম পয়েন্টের টি-শার্ট, পোলো ও জিন্সের ফিটিং কেমন?',
    answer:
      'আমাদের বক্সি টি-শার্টগুলো রিল্যাক্সড ড্রপ-শোল্ডার কাট (২৪০ জিএসএম হেভি কটন)। সিগনেচার পোলো শার্টগুলো স্মার্ট রেগুলার ফিট (২২০ জিএসএম কম্বড কটন পিকে, যাতে কলার কখনো কুঁকড়ে না যায়)। আর ডেনিম জিন্সগুলো সেমি-ব্যাগি ট্রেন্ডি ফিটে তৈরি যা স্নিকার্সের সাথে দুর্দান্ত স্ট্যাকিং লুক দেয়।',
    highlights: [
      'টি-শার্ট: ড্রপ-শোল্ডার রিল্যাক্সড বক্সি ফিট',
      'পোলো: টেইলর্ড কমফোর্ট ফিট (অ্যান্টি-কার্ল কলার)',
      'জিন্স: ট্রেন্ডি সেমি-ব্যাগি স্ট্রিট ফিট',
    ],
  },
  {
    id: 'faq-size-3',
    category: 'sizing',
    question: 'ধোয়ার পর কি কাপড় সংকুচিত (Shrink) বা রঙ বিবর্ণ হয়ে যায়?',
    answer:
      'না! অসাম পয়েন্টের সব কাপড় প্রি-শ্রাঙ্ক (Pre-shrunk) ও বিশেষ এনজাইম ওয়াশড। কাপড়ের ভেতরের ওয়াশ কেয়ার নির্দেশিকা অনুসরণ করে সাধারণ তাপমাত্রার পানিতে কোমলভাবে ধুলে ফেব্রিকের সাইজ এবং কালার দীর্ঘ সময় একই রকম থাকবে।',
    highlights: ['১০০% প্রি-শ্রাঙ্ক ফেব্রিক — সাইজ পরিবর্তন হবে না'],
  },

  // 4. Payment & Benefits
  {
    id: 'faq-pay-1',
    category: 'payment',
    question: 'কী কী উপায়ে পেমেন্ট পরিশোধ করা যায়?',
    answer:
      'আপনি সম্পূর্ণ ক্যাশ অন ডেলিভারিতে (COD) পণ্য হাতে পাওয়ার পর টাকা দিতে পারেন। কোনো অগ্রিম পেমেন্টের বাধ্যবাধকতা নেই। এছাড়া নিরাপদ অনলাইন চেকআউটের মাধ্যমে বিকাশ এবং নগদ মার্চেন্ট একাউন্টে ইনস্ট্যান্ট পেমেন্ট করার ব্যবস্থাও রয়েছে।',
    highlights: [
      'ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য',
      'বিকাশ ও নগদ ডিজিটাল পেমেন্ট সুবিধা',
    ],
  },
  {
    id: 'faq-pay-2',
    category: 'payment',
    question: 'অসাম ক্লাব (Awesome Club) রিওয়ার্ডস কীভাবে কাজ করে?',
    answer:
      'আমাদের শপে প্রতিটি কেনাকাটার সাথে সাথে স্বয়ংক্রিয়ভাবে অসাম ক্লাব পয়েন্ট জমা হয়। এই পয়েন্টগুলো জমিয়ে আপনি পরবর্তী অর্ডারে ক্যাশ ডিসকাউন্ট ভাউচার ও ফ্রি ডেলিভারি সুবিধা উপভোগ করতে পারেন। সিলভার, গোল্ড ও ব্ল্যাক টিয়ার সদস্যদের জন্য থাকে বিশেষ উইন্টার প্রি-অর্ডার সুযোগ।',
    highlights: ['প্রতি অর্ডারে পয়েন্ট অর্জন ও ভাউচার রিডিম'],
  },
];

type CategoryFilter = 'all' | 'shipping' | 'returns' | 'sizing' | 'payment';

export const FAQSection: React.FC = () => {
  const { setIsSizeGuideOpen, setIsTrackingOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-ship-1': true, // Keep first shipping item open by default
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAction = (actionType?: 'sizeGuide' | 'tracking' | 'whatsapp') => {
    if (actionType === 'sizeGuide') {
      setIsSizeGuideOpen(true);
    } else if (actionType === 'tracking') {
      setIsTrackingOpen(true);
    } else if (actionType === 'whatsapp') {
      window.open('https://wa.me/8801700000000?text=Hello%20Awesome%20Point%20Team,%20I%20have%20a%20question%20about%20my%20order', '_blank');
    }
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesText =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.highlights &&
          item.highlights.some((h) => h.toLowerCase().includes(query)));

      return matchesCategory && matchesText;
    });
  }, [selectedCategory, searchQuery]);

  const categories: { id: CategoryFilter; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'all',
      label: 'সব প্রশ্ন',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      count: FAQ_DATA.length,
    },
    {
      id: 'shipping',
      label: 'শিপিং ও ডেলিভারি',
      icon: <Truck className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((f) => f.category === 'shipping').length,
    },
    {
      id: 'returns',
      label: 'রিটার্ন ও এক্সচেঞ্জ',
      icon: <RotateCcw className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((f) => f.category === 'returns').length,
    },
    {
      id: 'sizing',
      label: 'সাইজ ও ফিটিং',
      icon: <Ruler className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((f) => f.category === 'sizing').length,
    },
    {
      id: 'payment',
      label: 'পেমেন্ট ও রিওয়ার্ডস',
      icon: <CreditCard className="w-3.5 h-3.5" />,
      count: FAQ_DATA.filter((f) => f.category === 'payment').length,
    },
  ];

  return (
    <section
      id="faq-section"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200"
      aria-label="সচরাচর জিজ্ঞাসিত প্রশ্নাবলী"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>প্রয়োজনীয় তথ্য ও তাৎক্ষণিক সমাধান</span>
        </div>
        <h2
          id="faq-section-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight"
        >
          সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          ডেলিভারি চার্জ, ওপেন-বক্স যাচাই, সাইজ নির্দেশিকা এবং সহজ এক্সচেঞ্জ পলিসি
          সম্পর্কে সকল সাধারণ প্রশ্নের পরিষ্কার ও নির্ভরযোগ্য উত্তর।
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="faq-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="আপনার প্রশ্ন বা কী-ওয়ার্ড লিখে খুঁজুন (যেমন: ডেলিভারি, সাইজ, এক্সচেঞ্জ, পেমেন্ট)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              id="faq-search-clear-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full"
              aria-label="অনুসন্ধান মুছুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          id="faq-category-filters"
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`faq-filter-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100/80 hover:text-neutral-950'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-neutral-800 text-amber-300'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="max-w-4xl mx-auto space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => {
            const isOpen = !!openItems[item.id];
            const categoryBadge = categories.find((c) => c.id === item.category);

            return (
              <div
                key={item.id}
                id={`faq-card-${item.id}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-neutral-300 shadow-sm'
                    : 'bg-white/80 hover:bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <button
                  id={`faq-toggle-btn-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {(index + 1).toLocaleString('bn-BD')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          {categoryBadge?.label}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-neutral-950 tracking-tight leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                      isOpen
                        ? 'bg-neutral-950 text-white border-neutral-950 rotate-180'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100/80"
                  >
                    <p className="mb-3">{item.answer}</p>

                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mb-4 bg-neutral-50 rounded-xl p-3 border border-neutral-200/80 space-y-1.5">
                        <span className="text-[11px] font-bold text-neutral-900 block">
                          একনজরে প্রধান পয়েন্টসমূহ:
                        </span>
                        <ul className="space-y-1">
                          {item.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-xs text-neutral-600"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.actionType && (
                      <div className="pt-2">
                        <button
                          id={`faq-action-btn-${item.id}`}
                          onClick={() => handleAction(item.actionType)}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-bold transition-colors"
                        >
                          {item.actionType === 'sizeGuide' && (
                            <Ruler className="w-3.5 h-3.5 text-neutral-700" />
                          )}
                          {item.actionType === 'tracking' && (
                            <Truck className="w-3.5 h-3.5 text-neutral-700" />
                          )}
                          {item.actionType === 'whatsapp' && (
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>{item.actionLabel}</span>
                          <ArrowRight className="w-3 h-3 text-neutral-400" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div
            id="faq-empty-state"
            className="text-center py-12 px-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3"
          >
            <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
            <h4 className="text-base font-bold text-neutral-900">
              কোনো প্রশ্ন খুঁজে পাওয়া যায়নি
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              "{searchQuery}" কী-ওয়ার্ডে কোনো উত্তর মেলেনি। অন্য কোনো শব্দ দিয়ে সার্চ করুন অথবা সরাসরি আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।
            </p>
            <button
              id="faq-reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              সব প্রশ্ন পুনরায় দেখুন
            </button>
          </div>
        )}
      </div>

      {/* Still Have Questions Support Banner */}
      <div
        id="faq-support-banner"
        className="max-w-4xl mx-auto mt-10 p-6 sm:p-7 rounded-2xl bg-neutral-950 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              সাপোর্ট টিম সক্রিয় আছে
            </span>
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold tracking-tight">
            আরও কিছু জানার আছে? আমরা আপনাকে সাহায্য করতে প্রস্তুত!
          </h4>
          <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
            সাইজ নির্বাচন, অর্ডার সংক্রান্ত প্রশ্ন বা বিশেষ ডেলিভারি নির্দেশনার জন্য সরাসরি আমাদের সাপোর্ট টিমের সাথে কথা বলুন।
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <a
            id="faq-call-support-link"
            href="tel:+8801700000000"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-extrabold transition-all shrink-0 w-full sm:w-auto"
          >
            <PhoneCall className="w-3.5 h-3.5 text-neutral-950" />
            <span>০১৭০০-০০০০০০</span>
          </a>

          <a
            id="faq-whatsapp-support-link"
            href="https://wa.me/8801700000000?text=Hello%20Awesome%20Point,%20I%20need%20help%20with%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shrink-0 w-full sm:w-auto"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>হোয়াটসঅ্যাপে চ্যাট</span>
          </a>

          <a
            id="faq-facebook-support-link"
            href="https://www.facebook.com/awesomepoint420"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold transition-all border border-neutral-800 shrink-0"
            title="ফেসবুক পেজে মেসেজ করুন"
            aria-label="ফেসবুক পেজে মেসেজ করুন"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
