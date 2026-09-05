import React from 'react';
import { Truck, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PremiumServicesSection: React.FC = () => {
  const services = [
    {
      id: 'fast-delivery',
      title: 'Free and Fast Delivery',
      titleBn: 'দ্রুত হোম ডেলিভারি',
      desc: 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টায় ও ঢাকার বাইরে ৩-৪ দিনে দ্রুত হোম ডেলিভারি। ৳১,৫০০+ অর্ডারে ফ্রি ডেলিভারি!',
      icon: Truck,
      step: '০১',
    },
    {
      id: 'support',
      title: '24/7 Customer Service',
      titleBn: '২৪/৭ কাস্টমার সার্ভিস',
      desc: 'হোয়াটসঅ্যাপ বা ফোনে সার্বক্ষণিক সহায়তা। যেকোনো সাইজ পরামর্শ বা অর্ডারের আপডেটে সরাসরি কথা বলুন।',
      icon: Headphones,
      step: '০২',
    },
    {
      id: 'guarantee',
      title: 'Money Back Guarantee',
      titleBn: '৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ',
      desc: 'রাইডারের সামনে পার্সেল দেখে নিন। সাইজ না মিললে বা ত্রুটি থাকলে সাথে সাথে বিনামূল্যে পরিবর্তনের সুবিধা।',
      icon: ShieldCheck,
      step: '০৩',
    },
  ];

  return (
    <section className="bg-neutral-50/80 border-y border-neutral-200/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title & Trust Count */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Awesome Point Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Our Premium Services
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Trusted by 10,000+ satisfied customers across Bangladesh
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md hover:border-red-300 transition-all flex flex-col items-center text-center space-y-3 group"
              >
                {/* Circular Red Icon */}
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-neutral-400 tracking-widest">
                    STEP {item.step}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-neutral-950">
                    {item.title}
                  </h3>
                  <h4 className="text-xs font-bold text-red-600">
                    {item.titleBn}
                  </h4>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
