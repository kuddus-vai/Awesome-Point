import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      name: 'তানভীর আহমেদ',
      location: 'মিরপুর, ঢাকা',
      rating: 5,
      product: 'অক্সফোর্ড বাটন-ডাউন শার্ট',
      review: 'কাপড়ের কোয়ালিটি সত্যি অসাধারণ! কলার স্টিচিং এবং ফিটিংস একদম পারফেক্ট। ডেলিভারির সময় পার্সেল খুলে দেখার সুযোগ ছিল যা সবচেয়ে বড় পাওয়া।',
      date: '৩ দিন আগে',
      initials: 'তা',
    },
    {
      id: 'rev-2',
      name: 'মাহমুদুল হাসান',
      location: 'জিইসি, চট্টগ্রাম',
      rating: 5,
      product: '১৩.৫ আউন্স ভিন্টেজ সেমি-ব্যাগি জিন্স',
      review: 'অনলাইনে কাপড় কিনে এত খুশি আগে কখনও হইনি। জিন্সটির ফ্যাব্রিক হেভি এবং স্নিকার্সের সাথে দারুণ মানায়। সাইজ চার্ট দেখে অর্ডার করায় একদম সঠিক হয়েছে।',
      date: '১ সপ্তাহ আগে',
      initials: 'মা',
    },
    {
      id: 'rev-3',
      name: 'সাকিব রায়হান',
      location: 'উত্তরা, ঢাকা',
      rating: 5,
      product: 'ট্যাকটিক্যাল বম্বার জ্যাকেট',
      review: 'উইন্ডপ্রুফ ম্যাটেরিয়াল ও ইনার লাইনিং খুব প্রিমিয়াম ফিল দেয়। ঢাকায় শীতের দিনে বা রাইডিংয়ের সময় পরার জন্য সেরা চয়েস।',
      date: '২ সপ্তাহ আগে',
      initials: 'সা',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="flex items-center justify-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
          What Our Customers Say
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500">
          সারা বাংলাদেশের সন্তুষ্ট গ্রাহকদের নির্ভরযোগ্য অভিজ্ঞতা ও মতামত
        </p>
      </div>

      {/* 3 Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative"
          >
            <Quote className="w-8 h-8 text-neutral-200 absolute top-5 right-5 pointer-events-none" />

            <div className="space-y-3">
              {/* Stars & Verified */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ভেরিফাইড ক্রেতা</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                "{item.review}"
              </p>

              <div className="text-[11px] text-red-600 font-bold">
                আইটেম: {item.product}
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-black text-xs flex items-center justify-center">
                {item.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-neutral-900 leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {item.location} • {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
