import React from 'react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950 text-[10px] font-black tracking-tight">
            AP
          </span>
          <span className="font-semibold text-white tracking-wide text-[11px]">
            অসাম পয়েন্ট অফিশিয়াল স্টোর
          </span>
          <span className="hidden md:inline text-neutral-500">•</span>
          <span className="hidden md:inline text-neutral-400">
            সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-neutral-300 flex-wrap justify-center">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-neutral-400" />
            <span>ঢাকা ৳৮০ / ঢাকার বাইরে ৳১৫০</span>
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>৳১,৫০০+ অর্ডারে ফ্রি ডেলিভারি</span>
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ডোরস্টেপ সাইজ পরিবর্তন সুবিধা</span>
          </span>
        </div>
      </div>
    </div>
  );
};

